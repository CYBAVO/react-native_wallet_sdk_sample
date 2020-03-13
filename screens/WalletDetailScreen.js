/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import {
  Container,
  Button,
  Text,
  Header,
  Title,
  Body,
  Icon,
  Left,
  Right,
  Badge,
  Card,
  CardItem,
  Item,
  Input,
} from 'native-base';
import moment from 'moment';
import Modal from 'react-native-modal';
import { Wallets } from '@cybavo/react-native-wallet-service';
import { fetchWallet, fetchBalance } from '../store/actions';
import CurrencyText from '../components/CurrencyText';
import Balance from '../components/Balance';
import TransactionList from '../components/TransactionList';
import Filter from '../components/Filter';
import { colorPrimary, colorAccent, Coin, isFungibleToken } from '../Constants';
import { toastError } from '../Helpers';

const FILTER_DIRECTION = [
  null,
  Wallets.Transaction.Direction.IN,
  Wallets.Transaction.Direction.OUT,
];
const FILTER_PENDING = [null, true, false];
const FILTER_SUCCESS = [null, true, false];
const FILTER_TIME_ALL = 0;
const FILTER_TIME_TODAY = 1;
const FILTER_TIME_YESTERDAY = 2;

class WalletDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header noShadow>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{navigation.state.params.wallet.name}</Title>
        </Body>
        <Right>
          {Coin.EOS === navigation.state.params.wallet.currency && (
            <Button transparent onPress={navigation.getParam('goEosResource')}>
              <Icon name="stats" />
            </Button>
          )}
          <Button transparent onPress={navigation.getParam('renameWallet')}>
            <Icon name="create" />
          </Button>
        </Right>
      </Header>
    ),
  });

  state = {
    historyTransactions: [],
    historyLoading: false,
    historyHasMore: true,
    filterTime: 0,
    filterDirection: 0,
    filterPending: 0,
    filterSuccess: 0,
    renameInProgress: false,
    renameNewName: '',
    renameLoading: false,
    moreFilters: false,
  };

  componentDidMount = () => {
    const { navigation, fetchWallet, fetchBalance } = this.props;
    navigation.setParams({ renameWallet: this._renameWallet });
    navigation.setParams({ goEosResource: this._goEosResource });

    const wallet = navigation.state.params.wallet;
    if (!wallet) {
      console.warn('No wallet specified');
      navigation.goBack();
      return;
    }
    fetchWallet();
    fetchBalance(false);
    this._fetchMoreHistory();
  };

  componentWillReceiveProps = () => {};

  _fetchMoreHistory = () => {
    const {
      historyHasMore,
      historyLoading,
      filterDirection,
      filterPending,
      filterSuccess,
      filterTime,
    } = this.state;
    if (!historyHasMore || historyLoading) {
      return;
    }
    this.setState({ historyLoading: true }, async () => {
      const count = 10;
      try {
        const { wallet } = this.props;
        const { historyTransactions } = this.state;

        let filters = {
          direction: FILTER_DIRECTION[filterDirection],
          pending: FILTER_PENDING[filterPending],
          success: FILTER_SUCCESS[filterSuccess],
        };

        if (filterTime === FILTER_TIME_TODAY) {
          filters = {
            ...filters,
            start_time: moment()
              .startOf('day')
              .unix(),
            end_time: moment().unix(),
          };
        } else if (filterTime === FILTER_TIME_YESTERDAY) {
          filters = {
            ...filters,
            start_time: moment()
              .startOf('day')
              .subtract(1, 'days')
              .unix(),
            end_time: moment()
              .startOf('day')
              .unix(),
          };
        }

        const result = await Wallets.getHistory(
          wallet.currency,
          wallet.tokenAddress,
          wallet.address,
          historyTransactions.length,
          count,
          filters
        );
        this.setState({
          historyTransactions: [...historyTransactions, ...result.transactions],
          historyHasMore:
            result.start + result.transactions.length < result.total,
        });
      } catch (error) {
        console.log('Wallets.getHistory failed', error);
        toastError(error);
      }
      this.setState({ historyLoading: false });
    });
  };

  _refresh = () => {
    const { fetchBalance } = this.props;
    this._refreshHistory();
    fetchBalance(true);
  };

  _refreshHistory = () => {
    // clear state then fetch
    this.setState(
      {
        historyTransactions: [],
        historyHasMore: true,
      },
      this._fetchMoreHistory
    );
  };

  _goTransactionDetail = transaction => {
    const { wallet, currencyItem } = this.props;
    this.props.navigation.navigate({
      routeName: 'TransactionDetail',
      params: {
        wallet,
        transaction,
        isFungibleToken: isFungibleToken(currencyItem),
      },
    });
  };

  _goDeposit = () => {
    const { wallet } = this.props;
    this.props.navigation.navigate({
      routeName: 'Deposit',
      params: {
        wallet,
      },
    });
  };

  _goWithdraw = () => {
    const { wallet, balances, currencyItem } = this.props;
    const balance =
      balances[`${wallet.currency}#${wallet.tokenAddress}#${wallet.address}`];
    this.props.navigation.navigate({
      routeName: 'Withdraw',
      params: {
        wallet,
        onComplete: this._refresh,
        tokenIds: balance ? balance.tokens : [],
        isFungibleToken: isFungibleToken(currencyItem),
      },
    });
  };
  _renameWallet = () => {
    const { wallet } = this.props;
    this.setState({
      renameInProgress: true,
      renameLoading: false,
      renameNewName: wallet.name,
    });
  };

  _cancelRename = () => {
    this.setState({
      renameInProgress: false,
    });
  };

  _performRename = async () => {
    const { renameNewName } = this.state;
    const { wallet, fetchWallet, navigation } = this.props;
    this.setState({
      renameLoading: true,
    });
    await Wallets.renameWallet(wallet.walletId, renameNewName);
    await fetchWallet();
    this.setState({
      renameLoading: false,
      renameInProgress: false,
    });
    // update title
    navigation.setParams({ wallet: this.props.wallet });
  };

  _goEosResource = () => {
    const { navigation, wallet } = this.props;
    navigation.navigate({
      routeName: 'EosResource',
      params: {
        wallet,
      },
    });
  };

  _setFilterTime = time => {
    this.setState({
      filterTime: time,
    });
    this._refresh();
  };

  _setFilterDirection = direction => {
    this.setState({
      filterDirection: direction,
    });
    this._refresh();
  };

  _setFilterPending = pending => {
    this.setState({
      filterPending: pending,
    });
    this._refresh();
  };

  _setFilterSuccess = success => {
    this.setState({
      filterSuccess: success,
    });
    this._refresh();
  };

  render() {
    const { wallet } = this.props;
    const {
      historyTransactions,
      historyLoading,
      historyHasMore,
      filterTime,
      filterDirection,
      filterPending,
      filterSuccess,
      renameInProgress,
      renameNewName,
      renameLoading,
      moreFilters,
    } = this.state;

    const initialLoading =
      historyLoading && Object.keys(historyTransactions).length === 0;
    const loadingMore =
      historyLoading && Object.keys(historyTransactions).length > 0;

    return (
      <>
        <Container>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: colorPrimary,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  marginHorizontal: 16,
                }}
              >
                <Balance
                  {...wallet}
                  textStyle={{
                    color: 'white',
                    fontSize: 34,
                    maxWidth: '60%',
                  }}
                />
                <CurrencyText
                  {...wallet}
                  symbol
                  textStyle={{ color: 'white', fontSize: 24, marginLeft: 8 }}
                />
              </View>
              <Text style={{ fontSize: 12, color: 'white', opacity: 0.75 }}>
                {wallet.address}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
              <Button
                full
                transparent
                onPress={this._goDeposit}
                style={{ flex: 1 }}
              >
                <Text style={{ fontSize: 14, color: 'white' }}>Deposit</Text>
              </Button>
              <Button
                full
                transparent
                onPress={this._goWithdraw}
                style={{ flex: 1 }}
              >
                <Text style={{ fontSize: 14, color: 'white' }}>Withdraw</Text>
              </Button>
            </View>
          </View>
          <ScrollView horizontal={true} style={{ flexGrow: 0 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 8,
              }}
            >
              <Filter
                containerStyle={{ margin: 8 }}
                options={['ALL', 'RECEIVED', 'SENT']}
                selected={filterDirection}
                onChange={this._setFilterDirection}
              />

              {!moreFilters && (
                <Icon
                  name="ios-more"
                  style={{
                    color: colorPrimary,
                    padding: 8,
                  }}
                  onPress={() => this.setState({ moreFilters: true })}
                />
              )}
              {moreFilters && (
                <>
                  <Filter
                    containerStyle={{ margin: 8 }}
                    options={['ALL TIME', 'TODAY', 'YESTERDAY']}
                    selected={filterTime}
                    onChange={this._setFilterTime}
                  />
                  <Filter
                    containerStyle={{ margin: 8 }}
                    options={['ALL', 'PENDING', 'DONE']}
                    selected={filterPending}
                    onChange={this._setFilterPending}
                  />
                  <Filter
                    containerStyle={{ margin: 8 }}
                    options={['ALL', 'SUCCESS', 'FAILED']}
                    selected={filterSuccess}
                    onChange={this._setFilterSuccess}
                  />
                </>
              )}
            </View>
          </ScrollView>
          <View
            style={{
              flex: 2,
            }}
          >
            {historyTransactions && (
              <TransactionList
                wallet={wallet}
                transactions={Object.values(historyTransactions)}
                onTransactionPress={this._goTransactionDetail}
                refreshing={initialLoading}
                onRefresh={this._refresh}
                onEndReached={this._fetchMoreHistory}
              />
            )}

            {(!historyHasMore || loadingMore) && (
              <Badge
                primary
                style={{
                  position: 'absolute',
                  bottom: 16,
                  alignSelf: 'center',
                  elevation: 2,
                  opacity: 0.75,
                }}
              >
                <Text>{loadingMore ? 'Loading more…' : 'End of History'}</Text>
              </Badge>
            )}
          </View>
        </Container>
        <Modal
          isVisible={renameInProgress}
          onBackdropPress={this._cancelRename}
          onBackButtonPress={this._cancelRename}
        >
          <Card>
            <CardItem header>
              <Text>Rename wallet</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Item regular>
                  <Input
                    autoCapitalize="words"
                    value={renameNewName}
                    editable={!renameLoading}
                    onChangeText={text =>
                      this.setState({ renameNewName: text })
                    }
                  />
                  {renameLoading && (
                    <ActivityIndicator
                      color={colorAccent}
                      size="small"
                      style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        right: 16,
                      }}
                    />
                  )}
                </Item>
              </Body>
            </CardItem>
            <CardItem
              footer
              style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <Button
                transparent
                onPress={this._cancelRename}
                disabled={renameLoading}
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                transparent
                onPress={this._performRename}
                disabled={renameLoading}
              >
                <Text>Save</Text>
              </Button>
            </CardItem>
          </Card>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const wallet = ownProps.navigation.state.params.wallet;
  const {
    balance: { balances = {} },
  } = state;
  return {
    wallet: (state.wallets.wallets || []).find(
      w => w.walletId === wallet.walletId
    ),
    balances: balances,
    currencyItem: (state.currency.currencies || []).find(
      c =>
        c.currency === wallet.currency && c.tokenAddress === wallet.tokenAddress
    ),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const wallet = ownProps.navigation.state.params.wallet;
  return {
    fetchWallet: () => dispatch(fetchWallet(wallet.walletId)),
    fetchBalance: refresh =>
      dispatch(
        fetchBalance(
          wallet.currency,
          wallet.tokenAddress,
          wallet.address,
          refresh
        )
      ),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletDetailScreen);
