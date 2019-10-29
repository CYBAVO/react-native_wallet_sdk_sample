/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
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
  Item,
  Input,
  Form,
  Label,
} from 'native-base';
import { Wallets } from '@cybavo/react-native-wallet-service';
import { fetchWallets, fetchCurrenciesIfNeed } from '../store/actions';
import CurrencyPicker from '../components/CurrencyPicker';
import WalletPicker from '../components/WalletPicker';
import InputPinCodeModal from '../components/InputPinCodeModal';
import { toastError } from '../Helpers';
import { Coin } from '../Constants';

class CreateWalletScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>New wallet</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    loading: false,
    name: '',
    accountName: '',
    currency: null,
    parentIdx: 0,
    inputPinCode: false,
  };

  componentDidMount = async () => {
    const { fetchWallets, fetchCurrencies } = this.props;
    await fetchCurrencies();
    await fetchWallets();
  };

  _setCurrency = currency => {
    this.setState({ currency });
  };

  _getAvailableCurrencies = () => {
    const { wallets = [], currencies } = this.props;
    if (!currencies || !currencies.length) {
      return [];
    }
    return currencies.filter(
      currency =>
        !(wallets || []).find(
          wallet =>
            wallet.currency === currency.currency &&
            wallet.tokenAddress === currency.tokenAddress
        )
    );
  };

  _getSelectedCurrency = () => {
    if (this.state.currency) {
      return this.state.currency;
    }
    const currencies = this._getAvailableCurrencies();
    return currencies[0] || {};
  };

  _getAvailableParents = (wallets, currency) => {
    if (!wallets || !currency) return [];
    return wallets.filter(
      w => w.currency === currency.currency && !w.tokenAddress
    );
  };

  _setParent = parentIdx => {
    this.setState({ parentIdx });
  };

  _submit = async () => {
    const { accountName } = this.state;
    const currency = this._getSelectedCurrency();
    // check account name for EOS
    if (Coin.EOS === currency.currency && !currency.tokenAddress) {
      try {
        // eslint-disable-next-line no-template-curly-in-string
        var regex = new RegExp('^[a-z1-5]{12}$');
        if (!regex.test(accountName)) {
          toastError(new Error('Account Name only allow a-z, 1-5. length 12'));
          return;
        }
        this.setState({ loading: true });
        const result = await Wallets.validateEosAccount(accountName);
        this.setState({ loading: false });
        if (!result.valid) {
          toastError(new Error('EOS account invalid'));
          return;
        }
        if (result.exist) {
          toastError(new Error('EOS account already exists'));
          return;
        }
      } catch (error) {
        console.log('validateEosAccount failed', error);
        toastError(error);
        return;
      }
    }

    this._inputPinCode();
  };

  _inputPinCode = () => {
    this.setState({ inputPinCode: true });
  };

  _finishInputPinCode = () => {
    this.setState({ inputPinCode: false });
  };

  _createWallet = async pinSecret => {
    const { name, parentIdx, accountName } = this.state;
    const { wallets, fetchWallets, navigation } = this.props;
    const currency = this._getSelectedCurrency();
    const parents = this._getAvailableParents(wallets, currency);
    const parent = parents[parentIdx] || {};
    this.setState({ loading: true });
    try {
      await Wallets.createWallet(
        currency.currency, // currency
        currency.tokenAddress, // tokenAddress
        parent.walletId || 0, // parentWalletId
        name, // name
        pinSecret, // pinSecret
        {
          account_name:
            currency.currency === Coin.EOS ? accountName : undefined,
          // EOS specified extras
        } // extraAttributes
      );
      await fetchWallets();
      navigation.goBack();
    } catch (error) {
      console.log('_createWallet failed', error);
      toastError(error);
      this._finishInputPinCode();
    }
    this.setState({ loading: false });
  };

  render() {
    const { wallets } = this.props;
    const { loading, name, accountName, parentIdx, inputPinCode } = this.state;

    const currencies = this._getAvailableCurrencies();
    const currency = this._getSelectedCurrency();
    const parents = this._getAvailableParents(wallets, currency);
    const hasParent = !!currency.tokenAddress;
    const isValid = !!name;

    return (
      <Container>
        <Form style={{ flex: 1 }}>
          <Item stackedLabel>
            <Label>Currency</Label>
            <CurrencyPicker
              currencies={currencies}
              enabled={!loading}
              selected={currency}
              onValueChange={this._setCurrency}
            />
          </Item>
          {hasParent && (
            <Item stackedLabel>
              <Label>Parent wallet</Label>
              <WalletPicker
                enabled={!loading}
                selected={parentIdx}
                wallets={parents}
                onValueChange={this._setParent}
                filter={wallet =>
                  wallet.currency === currency.currency && !wallet.tokenAddress
                }
              />
            </Item>
          )}
          {/* EOS account */}
          {Coin.EOS === currency.currency && !currency.tokenAddress && (
            <Item stackedLabel>
              <Label>Account Name</Label>
              <Input
                autoCapitalize="words"
                placeholder="Account Name"
                placeholderTextColor="lightgray"
                editable={!loading}
                value={accountName}
                onChangeText={accountName => this.setState({ accountName })}
              />
            </Item>
          )}
          <Item stackedLabel>
            <Label>Name</Label>
            <Input
              autoCapitalize="words"
              placeholder={'Name this wallet'}
              placeholderTextColor="lightgray"
              editable={!loading}
              value={name}
              onChangeText={name => this.setState({ name })}
            />
          </Item>
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Button
              full
              style={{ margin: 16 }}
              disabled={loading || !isValid}
              onPress={this._submit}
            >
              <Text>Submit</Text>
            </Button>
          </View>
        </Form>
        <InputPinCodeModal
          isVisible={inputPinCode}
          onCancel={() => {
            this._finishInputPinCode();
          }}
          loading={loading}
          onInputPinCode={this._createWallet}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    currencies: state.currency.currencies,
    wallets: state.wallets.wallets,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWallets: () => dispatch(fetchWallets()),
    fetchCurrencies: () => dispatch(fetchCurrenciesIfNeed()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletScreen);
