/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { Wallets } from '@cybavo/react-native-wallet-service';
import {
  Container,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Title,
  Right,
  Text,
  Input,
  Radio,
  Form,
  Item,
  Label,
} from 'native-base';
import * as Progress from 'react-native-progress';
import { BigNumber } from 'bignumber.js';
import { fetchBalance } from '../store/actions';
import { toastError } from '../Helpers';
import InputPinCodeModal from '../components/InputPinCodeModal';
import { colorAccent } from '../Constants';

const styles = StyleSheet.create({
  label: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  progressBar: {
    marginTop: 8,
    marginHorizontal: 16,
    borderColor: colorAccent,
  },
  progressDesc: {
    marginTop: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  progressDescPrimary: {
    fontSize: 12,
  },
  progressDescSecondary: {
    flex: 1,
    fontSize: 12,
    color: 'darkgray',
    textAlign: 'right',
  },
  transactions: {
    maxHeight: 48,
    height: 48,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionRadio: {
    padding: 8,
  },
  transactionLabel: {
    fontSize: 12,
    marginEnd: 8,
  },
  input: {
    marginHorizontal: 16,
  },
  inputHint: {
    color: 'gray',
    fontSize: 12,
    marginHorizontal: 16,
  },
  submit: {
    margin: 16,
  },
});

const TRANSACTIONS = [
  { label: 'Buy RAM', type: Wallets.EosResourceTransactionType.BUY_RAM },
  { label: 'Sell RAM', type: Wallets.EosResourceTransactionType.SELL_RAM },
  {
    label: 'Delegate CPU',
    type: Wallets.EosResourceTransactionType.DELEGATE_CPU,
  },
  {
    label: 'Undelegate CPU',
    type: Wallets.EosResourceTransactionType.UNDELEGATE_CPU,
  },
  {
    label: 'Delegate NET',
    type: Wallets.EosResourceTransactionType.DELEGATE_NET,
  },
  {
    label: 'Undelegate NET',
    type: Wallets.EosResourceTransactionType.UNDELEGATE_NET,
  },
];
const SHOW_AMOUNT = [
  Wallets.EosResourceTransactionType.DELEGATE_CPU,
  Wallets.EosResourceTransactionType.UNDELEGATE_CPU,
  Wallets.EosResourceTransactionType.DELEGATE_NET,
  Wallets.EosResourceTransactionType.UNDELEGATE_NET,
];
const SHOW_NUM_BYTES = [
  Wallets.EosResourceTransactionType.BUY_RAM,
  Wallets.EosResourceTransactionType.SELL_RAM,
];
const SHOW_RECEIVER = [
  Wallets.EosResourceTransactionType.BUY_RAM,
  Wallets.EosResourceTransactionType.DELEGATE_CPU,
  Wallets.EosResourceTransactionType.DELEGATE_NET,
];

function calcProgress(used, max) {
  return max > 0 ? used / max : 0;
}

function calcWithPrec(amount, precision) {
  const div = new BigNumber(10).pow(precision);
  const big = new BigNumber(amount);
  return big.div(div).toString();
}

class EosResourceScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header noShadow>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>EOS resources</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    loading: false,
    ramPrice: 0,
    cpuAmount: 0,
    cpuAmountPrecision: 0,
    cpuAvailable: 0,
    cpuMax: 0,
    cpuRefund: 0,
    cpuRefundPrecision: 0,
    cpuUsed: 0,
    netAmount: 0,
    netAmountPrecision: 0,
    netAvailable: 0,
    netMax: 0,
    netRefund: 0,
    netRefundPrecision: 0,
    netUsed: 0,
    ramQuota: 0,
    ramUsage: 0,
    transactionType: Wallets.EosResourceTransactionType.BUY_RAM,
    amount: '0',
    numBytes: 0,
    receiver: '',
  };

  componentDidMount = () => {
    this._fetchResourceInfo();
  };

  _fetchResourceInfo = async () => {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    try {
      const { ramPrice } = await Wallets.getEosRamPrice();
      const {
        cpuAmount,
        cpuAmountPrecision,
        cpuAvailable,
        cpuMax,
        cpuRefund,
        cpuRefundPrecision,
        cpuUsed,
        netAmount,
        netAmountPrecision,
        netAvailable,
        netMax,
        netRefund,
        netRefundPrecision,
        netUsed,
        ramQuota,
        ramUsage,
      } = await Wallets.getEosResourceState(wallet.address);
      this.setState({
        ramPrice: Number(ramPrice),
        cpuAmount,
        cpuAmountPrecision,
        cpuAvailable,
        cpuMax,
        cpuRefund,
        cpuRefundPrecision,
        cpuUsed,
        netAmount,
        netAmountPrecision,
        netAvailable,
        netMax,
        netRefund,
        netRefundPrecision,
        netUsed,
        ramQuota,
        ramUsage,
      });
    } catch (error) {
      console.log('_fetchResourceInfo failed', error);
      toastError(error);
      this.setState({ ramPrice: 0 });
    }
    this.setState({ loading: false });
  };

  _setTransactionType = transactionType => {
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    this.setState({
      transactionType,
      amount: '0',
      numBytes: 0,
      receiver: wallet.address,
    });
  };

  _setNumBytes = numBytes => {
    let numBytesNum = 0;
    try {
      numBytesNum = Number(numBytes);
    } catch (error) {
      // ;
    }
    // calculate amount
    this.setState({
      numBytes: numBytesNum,
      amount: String((numBytes / 1024) * this.state.ramPrice),
    });
  };

  _isValid = () => {
    const { transactionType, amount, numBytes, receiver } = this.state;
    switch (transactionType) {
      case Wallets.EosResourceTransactionType.BUY_RAM:
        return numBytes > 0 && !!receiver;
      case Wallets.EosResourceTransactionType.SELL_RAM:
        return numBytes > 0;
      case Wallets.EosResourceTransactionType.DELEGATE_CPU:
      case Wallets.EosResourceTransactionType.DELEGATE_NET:
        return Number(amount) > 0 && !!receiver;
      case Wallets.EosResourceTransactionType.UNDELEGATE_CPU:
      case Wallets.EosResourceTransactionType.UNDELEGATE_NET:
        return Number(amount) > 0;
      default:
        return false;
    }
  };

  _inputPinCode = () => {
    this.setState({ inputPinCode: true });
  };

  _finishInputPinCode = () => {
    this.setState({ inputPinCode: false });
  };

  _createTransaction = async pinCode => {
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    const { transactionType, amount, numBytes, receiver } = this.state;

    this.setState({ loading: true });
    try {
      await Wallets.createTransaction(
        wallet.walletId,
        receiver,
        amount,
        '', // fee
        '', // description
        pinCode,
        {
          // EOS resource specific extras
          eos_transaction_type: transactionType,
          num_bytes: numBytes,
        }
      );
      await this._fetchResourceInfo();
      this.props.fetchBalance(true);
      // reset
      this.setState({
        amount: '0',
        numBytes: 0,
      });
    } catch (error) {
      console.log('_createTransaction failed', error);
      toastError(error);
    }
    this._finishInputPinCode();
    this.setState({ loading: false });
  };

  render() {
    const {
      loading,
      ramPrice,
      cpuUsed,
      cpuMax,
      cpuAmount,
      cpuAmountPrecision,
      cpuRefund,
      cpuRefundPrecision,
      netUsed,
      netMax,
      netAmount,
      netAmountPrecision,
      netRefund,
      netRefundPrecision,
      ramUsage,
      ramQuota,
      transactionType,
      amount = '0',
      numBytes = 0,
      receiver,
      inputPinCode,
    } = this.state;

    return (
      <Container
        style={{
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        {/* status */}
        <Text style={styles.label}>RAM</Text>
        <Progress.Bar
          indeterminate={loading}
          progress={calcProgress(ramUsage, ramQuota)}
          width={null}
          color={colorAccent}
          style={styles.progressBar}
          useNativeDriver={true}
        />
        <View style={styles.progressDesc}>
          <Text style={styles.progressDescPrimary}>
            {`${ramPrice} EOS/Kbytes`}
          </Text>
          <Text style={styles.progressDescSecondary}>
            {`${ramUsage} / ${ramQuota} bytes`}
          </Text>
        </View>

        <Text style={styles.label}>CPU</Text>
        <Progress.Bar
          indeterminate={loading}
          progress={calcProgress(cpuUsed, cpuMax)}
          width={null}
          color={colorAccent}
          style={styles.progressBar}
          useNativeDriver={true}
        />
        <View style={styles.progressDesc}>
          <Text style={styles.progressDescPrimary}>
            {`${calcWithPrec(
              cpuAmount,
              cpuAmountPrecision
            )} staked • ${calcWithPrec(
              cpuRefund,
              cpuRefundPrecision
            )} refunding`}
          </Text>
          <Text style={styles.progressDescSecondary}>
            {`${cpuUsed} / ${cpuMax} μs`}
          </Text>
        </View>

        <Text style={styles.label}>NET</Text>
        <Progress.Bar
          indeterminate={loading}
          progress={calcProgress(netUsed, netMax)}
          width={null}
          color={colorAccent}
          style={styles.progressBar}
          useNativeDriver={true}
        />
        <View style={styles.progressDesc}>
          <Text style={styles.progressDescPrimary}>
            {`${calcWithPrec(
              netAmount,
              netAmountPrecision
            )} staked • ${calcWithPrec(
              netRefund,
              netRefundPrecision
            )} refunding`}
          </Text>
          <Text style={styles.progressDescSecondary}>
            {`${netUsed} / ${netMax} bytes`}
          </Text>
        </View>

        {/* transaction */}
        <Text style={[styles.label, { marginTop: 8 }]}>Transaction</Text>
        <ScrollView
          horizontal={true}
          style={styles.transactions}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        >
          {TRANSACTIONS.map(({ label, type }) => (
            <View key={type} style={styles.transaction}>
              <Radio
                disabled={loading}
                style={styles.transactionRadio}
                selected={type === transactionType}
                onPress={() => this._setTransactionType(type)}
              />
              <Text style={styles.transactionLabel}>{label}</Text>
            </View>
          ))}
        </ScrollView>

        <Form style={{ flex: 1 }}>
          {/* amount */}
          {SHOW_AMOUNT.includes(transactionType) && (
            <Item stackedLabel>
              <Label>Amount</Label>
              <Input
                keyboardType="number-pad"
                editable={!loading}
                value={amount}
                onChangeText={amount => this.setState({ amount })}
              />
            </Item>
          )}

          {/* numBytes */}
          {SHOW_NUM_BYTES.includes(transactionType) && (
            <>
              <Item stackedLabel>
                <Label>Number of bytes</Label>
                <Input
                  keyboardType="number-pad"
                  editable={!loading}
                  value={String(numBytes)}
                  onChangeText={numBytes => this._setNumBytes(numBytes)}
                />
              </Item>
              <Text style={styles.inputHint}>{`≈ ${amount} EOS`}</Text>
            </>
          )}

          {/* receiver */}
          {SHOW_RECEIVER.includes(transactionType) && (
            <Item stackedLabel>
              <Label>Receiver</Label>
              <Input
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                value={receiver}
                onChangeText={receiver => this.setState({ receiver })}
              />
            </Item>
          )}
        </Form>

        <Button
          style={styles.submit}
          full
          disabled={loading || !this._isValid()}
          onPress={() => this._inputPinCode()}
        >
          <Text>
            {TRANSACTIONS.find(({ type }) => transactionType === type).label}
          </Text>
        </Button>

        <InputPinCodeModal
          isVisible={!!inputPinCode}
          onCancel={() => {
            this._finishInputPinCode();
          }}
          loading={loading}
          onInputPinCode={pinCode => {
            this._createTransaction(pinCode);
          }}
        />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const wallet = ownProps.navigation.state.params.wallet;
  return {
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
  null,
  mapDispatchToProps
)(EosResourceScreen);
