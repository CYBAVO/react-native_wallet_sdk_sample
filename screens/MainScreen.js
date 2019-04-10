/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import {
  Container,
  Button,
  Header,
  Title,
  Body,
  Icon,
  Right,
  Content,
  Text,
} from 'native-base';
import { Wallets } from '@cybavo/react-native-wallet-service';
import { fetchUserState, fetchWallets, fetchBalance } from '../store/actions';
import WalletList from '../components/WalletList';
import { colorPrimary } from '../Constants';

class MainScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const {
      state: { params = {} },
    } = navigation;
    return {
      header: (
        <Header noLeft>
          <Body>
            <Title>CYBAVO Wallet</Title>
          </Body>
          <Right>
            <Button transparent onPress={params.onCreateWallet}>
              <Icon name="add" />
            </Button>
            <Button transparent onPress={() => navigation.navigate('Settings')}>
              <Icon name="md-settings" />
            </Button>
          </Right>
        </Header>
      ),
    };
  };

  state = {
    appState: AppState.currentState,
  };

  componentDidMount = async () => {
    const { navigation } = this.props;
    navigation.setParams({ onCreateWallet: this._goCreateWallet });
    AppState.addEventListener('change', this._handleAppStateChange);
    this.props.fetchWallets();
    await this.props.fetchUserState();
    const { userState } = this.props;
    if (userState.setPin === false) {
      this._goSetup();
    }
  };

  componentWillUnmount = () => {
    AppState.removeEventListener('change', this._handleAppStateChange);
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { appState } = this.state;
    if (prevState.appState !== 'background' && appState === 'background') {
      this._clearSecureToken();
    }
  };

  _handleAppStateChange = nextAppState => {
    this.setState({ appState: nextAppState });
  };

  _clearSecureToken = async () => {
    await Wallets.clearSecureToken();
    console.log('Wallets.clearSecureToken');
  };

  _goSetup = () => {
    this.props.navigation.navigate('SetupPinCode');
  };

  _goCreateWallet = () => {
    const { userState, navigation } = this.props;
    if (userState.setPin) {
      navigation.navigate('CreateWallet');
    } else {
      this._goSetup();
    }
  };

  _goWalletDetail = wallet => {
    this.props.navigation.navigate({
      routeName: 'WalletDetail',
      params: {
        wallet,
      },
    });
  };

  _goSettings = () => {
    this.props.navigation.navigate('Settings');
  };

  _refresh = async () => {
    const { fetchWallets, refreshBalances } = this.props;
    await fetchWallets();
    refreshBalances(this.props.wallets);
  };

  render() {
    const { userState, wallets, walletsLoading } = this.props;
    const hasWallet = wallets && wallets.length > 0;
    return (
      <Container>
        {/* No PIN */}
        {!userState.setPin && (
          <Content
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button
              transparent
              style={{
                height: 'auto',
                alignSelf: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onPress={this._goSetup}
            >
              <Icon
                name="color-wand"
                style={{ fontSize: 128, color: colorPrimary, opacity: 0.5 }}
              />
              <Text
                style={{
                  color: colorPrimary,
                }}
              >
                Finish setup now!
              </Text>
            </Button>
          </Content>
        )}
        {/* No Wallets */}
        {userState.setPin && wallets && wallets.length === 0 && (
          <Content
            contentContainerStyle={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button
              transparent
              style={{
                height: 'auto',
                alignSelf: 'center',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onPress={this._goCreateWallet}
            >
              <Icon
                name="bulb"
                style={{ fontSize: 128, color: colorPrimary, opacity: 0.5 }}
              />
              <Text
                style={{
                  color: colorPrimary,
                }}
              >
                Create a wallet now!
              </Text>
            </Button>
          </Content>
        )}
        {userState.setPin && wallets && wallets.length > 0 && (
          <WalletList
            wallets={wallets}
            onWalletPress={this._goWalletDetail}
            onRefresh={this._refresh}
            refreshing={walletsLoading || userState.loading}
          />
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userState: state.user.userState,
    wallets: state.wallets.wallets,
    walletsLoading: state.wallets.loading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchUserState: () => dispatch(fetchUserState()),
    fetchWallets: () => dispatch(fetchWallets()),
    refreshBalances: addresses => {
      (addresses || []).forEach(addr =>
        dispatch(
          fetchBalance(addr.currency, addr.tokenAddress, addr.address, true)
        )
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreen);
