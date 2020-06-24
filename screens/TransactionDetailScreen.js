/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import {
  Container,
  Content,
  Button,
  Text,
  Header,
  Title,
  Body,
  Icon,
  Left,
  Right,
  Badge,
} from 'native-base';
import { Wallets } from '@cybavo/react-native-wallet-service';
import CurrencyIcon from '../components/CurrencyIcon';
import CurrencyText from '../components/CurrencyText';
import DisplayTime from '../components/DisplayTime';
import InputPinCodeModal from '../components/InputPinCodeModal';
import { toastError } from '../Helpers';
import { getTransactionExplorerUri, colorDanger } from '../Constants';

const styles = StyleSheet.create({
  label: {
    marginTop: 16,
  },
  value: {
    opacity: 0.5,
    fontSize: 14,
  },
  badge: {
    marginStart: 8,
  },
});

const ACTION_UPDATE_FEE = 'update_fee';
const ACTION_CANCEL = 'cancel';
const LARGER_TX_FEE = '0.0000003'; // must be at least 10% higher than original transaction, let's just hard-coded a value for now

export default class TransactionDetailScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Transaction</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = {
    confirmBlocks: null,
    inputPinCode: null,
    loading: false,
  };

  componentDidMount = () => {
    this._fetchTransactionDetail();
  };

  _fetchTransactionDetail = async () => {
    const { navigation } = this.props;
    const { transaction, wallet } = navigation.state.params;
    if (transaction.txid === '' || transaction.dropped) {
      return;
    }
    try {
      const { confirmBlocks, data } = await Wallets.getTransactionInfo(
        wallet.currency,
        transaction.txid
      );
      this.setState({ confirmBlocks });
    } catch (error) {
      console.log('Wallets.getTransactionInfo failed', error);
      toastError(error);
    }
  };

  _explorer = () => {
    const { navigation } = this.props;
    const { transaction, wallet } = navigation.state.params;
    const uri = getTransactionExplorerUri({ ...wallet, ...transaction });
    if (uri) {
      Linking.openURL(uri).catch(console.error);
    }
  };

  _increaseTransactionFee = async pinSecret => {
    const { navigation } = this.props;
    const { transaction, wallet } = navigation.state.params;

    this.setState({ loading: true });
    try {
      await Wallets.increaseTransactionFee(
        wallet.walletId,
        transaction.txid,
        LARGER_TX_FEE,
        pinSecret
      );
      navigation.goBack();
    } catch (error) {
      console.log('Wallets.increaseTransactionFee failed', error);
      toastError(error);
      this._finishInputPinCode();
    }
    this.setState({ loading: false });
  };

  _cancelTransaction = async pinSecret => {
    const { navigation } = this.props;
    const { transaction, wallet } = navigation.state.params;

    this.setState({ loading: true });
    try {
      await Wallets.cancelTransaction(
        wallet.walletId,
        transaction.txid,
        LARGER_TX_FEE,
        pinSecret
      );
      navigation.goBack();
    } catch (error) {
      console.log('Wallets.cancelTransaction failed', error);
      toastError(error);
      this._finishInputPinCode();
    }
    this.setState({ loading: false });
  };

  _inputPinCode = action => {
    this.setState({ inputPinCode: action });
  };

  _finishInputPinCode = () => {
    this.setState({ inputPinCode: null });
  };

  render() {
    const { navigation } = this.props;
    const { transaction, wallet, isFungibleToken } = navigation.state.params;
    const withdraw = transaction.fromAddress === wallet.address;
    const { confirmBlocks, inputPinCode, loading } = this.state;
    // console.log('TX', transaction);
    return (
      <Container>
        <Content
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
            }}
          >
            <CurrencyIcon {...wallet} dimension={42} />
            <CurrencyText
              {...wallet}
              textStyle={{
                fontSize: 24,
                marginStart: 8,
              }}
            />
          </View>

          <View
            style={[
              styles.label,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Text>From</Text>
            {withdraw && (
              <Badge warning style={styles.badge}>
                <Text>WITHDRAW</Text>
              </Badge>
            )}
          </View>
          <Text style={styles.value}>{transaction.fromAddress}</Text>

          <View
            style={[
              styles.label,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Text>To</Text>
            {!withdraw && (
              <Badge success style={styles.badge}>
                <Text>DEPOSIT</Text>
              </Badge>
            )}
          </View>
          <Text style={styles.value}>{transaction.toAddress}</Text>

          <View
            style={[
              styles.label,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Text>{isFungibleToken ? 'Token ID' : 'Amount'}</Text>
            {transaction.platformFee && (
              <Badge info style={styles.badge}>
                <Text>PLATFORM FEE</Text>
              </Badge>
            )}
          </View>
          <Text style={styles.value}>
            {transaction.amount} {!isFungibleToken && wallet.currencySymbol}
          </Text>

          <Text style={styles.label}>Transaction fee</Text>
          <Text style={styles.value}>{transaction.transactionFee}</Text>

          <View
            style={[
              styles.label,
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Text>TXID</Text>
            {transaction.pending && (
              <Badge style={[styles.badge, { backgroundColor: 'gray' }]}>
                <Text>PENDING</Text>
              </Badge>
            )}
            {!transaction.success && (
              <Badge danger style={styles.badge}>
                <Text>FAILED</Text>
              </Badge>
            )}
            {transaction.dropped && (
              <Badge danger style={styles.badge}>
                <Text>DROPPED</Text>
              </Badge>
            )}
            {transaction.replaced && (
              <Badge info style={styles.badge}>
                <Text>REPLACED</Text>
              </Badge>
            )}
            {confirmBlocks != null && (
              <Badge success style={styles.badge}>
                <Text>{confirmBlocks} CONFIRMED</Text>
              </Badge>
            )}
          </View>
          {!!transaction.txid && (
            <Text
              style={[
                styles.value,
                {
                  textDecorationLine:
                    transaction.dropped || transaction.replaced
                      ? 'line-through'
                      : 'none',
                },
              ]}
            >
              {transaction.txid}
            </Text>
          )}
          {!!transaction.replaceTxid && (
            <Text style={[styles.value]}>{transaction.replaceTxid}</Text>
          )}
          {!!transaction.error && (
            <Text style={[styles.value, { color: colorDanger }]}>
              {transaction.error}
            </Text>
          )}

          <Text style={styles.label}>Memo</Text>
          <Text style={styles.value}>{transaction.memo || '-'}</Text>

          <Text style={styles.label}>Time</Text>
          <DisplayTime textStyle={styles.value} unix={transaction.timestamp} />

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{transaction.description || '-'}</Text>
        </Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            width: '50%',
            margin: 16,
          }}
        >
          <Button
            style={{ marginHorizontal: 4 }}
            bordered
            onPress={this._explorer}
          >
            <Text>Explorer</Text>
          </Button>
          {transaction.replaceable && (
            <>
              <Button
                style={{ marginHorizontal: 4 }}
                success
                onPress={() => this._inputPinCode(ACTION_UPDATE_FEE)}
              >
                <Text>Speed up</Text>
              </Button>
              <Button
                style={{ marginHorizontal: 4 }}
                danger
                onPress={() => this._inputPinCode(ACTION_CANCEL)}
              >
                <Text>Cancel</Text>
              </Button>
            </>
          )}
        </View>

        <InputPinCodeModal
          isVisible={!!inputPinCode}
          onCancel={() => {
            this._finishInputPinCode();
          }}
          loading={loading}
          onInputPinCode={pinSecret => {
            if (inputPinCode === ACTION_UPDATE_FEE) {
              this._increaseTransactionFee(pinSecret);
            } else {
              // cancel
              this._cancelTransaction(pinSecret);
            }
          }}
        />
      </Container>
    );
  }
}
