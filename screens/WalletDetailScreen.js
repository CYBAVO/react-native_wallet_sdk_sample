import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
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
  Footer,
  FooterTab,
  Badge,
  Card,
  CardItem,
  Item,
  Input,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Modal from 'react-native-modal';
import { Wallets } from '@cybavo/react-native-wallet-service';
import { fetchWallet, fetchBalance } from '../store/actions';
import CurrencyText from '../components/CurrencyText';
import Balance from '../components/Balance';
import TransactionList from '../components/TransactionList';
import { colorPrimary, colorAccent } from '../Constants';
import { toastError } from '../Helpers';

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
    renameInProgress: false,
    renameNewName: '',
    renameLoading: false,
  };

  componentDidMount = () => {
    const { navigation, fetchWallet, fetchBalance } = this.props;
    navigation.setParams({ renameWallet: this._renameWallet });
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
    const { historyHasMore, historyLoading } = this.state;
    if (!historyHasMore || historyLoading) {
      return;
    }
    this.setState({ historyLoading: true }, async () => {
      const count = 10;
      try {
        const { wallet } = this.props;
        const { historyTransactions } = this.state;
        const history = await Wallets.getHistory(
          wallet.currency,
          wallet.tokenAddress,
          wallet.address,
          historyTransactions.length,
          count
        );
        this.setState({
          historyTransactions: [
            ...historyTransactions,
            ...history.transactions,
          ],
          historyHasMore: history.transactions.length >= count,
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
    const { wallet } = this.props;
    this.props.navigation.navigate({
      routeName: 'TransactionDetail',
      params: {
        wallet,
        transaction,
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
    const { wallet } = this.props;
    this.props.navigation.navigate({
      routeName: 'Withdraw',
      params: {
        wallet,
        onComplete: this._refresh,
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

  render() {
    const { wallet } = this.props;
    const {
      historyTransactions,
      historyLoading,
      historyHasMore,
      renameInProgress,
      renameNewName,
      renameLoading,
    } = this.state;

    const initialLoading =
      historyLoading && Object.keys(historyTransactions).length === 0;
    const loadingMore =
      historyLoading && Object.keys(historyTransactions).length > 0;

    return (
      <>
        <Container>
          <Grid>
            <Row
              size={1}
              style={{
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

              <Footer style={{ elevation: 0 }}>
                <FooterTab>
                  <Button onPress={this._goDeposit}>
                    <Text style={{ fontSize: 14, color: 'white' }}>
                      Deposit
                    </Text>
                  </Button>
                  <Button onPress={this._goWithdraw}>
                    <Text style={{ fontSize: 14, color: 'white' }}>
                      Withdraw
                    </Text>
                  </Button>
                </FooterTab>
              </Footer>
            </Row>
            <Row size={2}>
              <Col>
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
                    <Text>
                      {loadingMore ? 'Loading more…' : 'End of History'}
                    </Text>
                  </Badge>
                )}
              </Col>
            </Row>
          </Grid>
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
  return {
    wallet: (state.wallets.wallets || []).find(
      w => w.walletId === wallet.walletId
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
