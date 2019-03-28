import React, { Component } from 'react';
import { View, Clipboard, CameraRoll, PermissionsAndroid } from 'react-native';
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
  Toast,
} from 'native-base';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import CurrencyIcon from '../components/CurrencyIcon';
import CurrencyText from '../components/CurrencyText';
import { colorPrimary } from '../Constants';
import { toastError } from '../Helpers';

export default class DepositScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header noShadow>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Deposit</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  state = { loading: false };
  _copyAdress = async () => {
    Toast.show({ text: 'OKK' });
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    await Clipboard.setString(wallet.address);
    Toast.show({ text: 'Address copied' });
  };

  _checkFsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('_checkFsPermission failed', error);
      toastError(error);
    }
    return false;
  };

  _qrCode = null;
  _saveQrCode = async () => {
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;
    this.setState({ loading: true });

    const hasPermission = await this._checkFsPermission();
    if (!hasPermission) {
      console.warn('Permission denied');
      return;
    }

    if (this._qrCode) {
      this._qrCode.toDataURL(async data => {
        const path = `${RNFS.DocumentDirectoryPath}/${wallet.name}-${
          wallet.address
        }.png`;
        try {
          await RNFS.writeFile(path, data, 'base64');
          await CameraRoll.saveToCameraRoll(path, 'photo');
          Toast.show({ text: 'QR code saved' });
        } catch (error) {
          console.log('_saveQrCode failed', error);
          toastError(error);
        }
        this.setState({ loading: false });
      });
    }
  };

  render() {
    const { loading } = this.state;
    const { navigation } = this.props;
    const wallet = navigation.state.params.wallet;

    return (
      <Container>
        <Content
          contentContainerStyle={{
            backgroundColor: colorPrimary,
            padding: 16,
            flex: 1,
            alignItems: 'center',
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
                color: 'white',
                marginStart: 8,
              }}
            />
          </View>

          <Text
            style={{
              color: 'white',
              opacity: 0.7,
              fontSize: 14,
              textAlign: 'center',
              marginTop: 24,
            }}
          >
            {`Send only ${
              wallet.currencySymbol
            } to this deposit address. Sending and other coin or token to the address may result in the loss of your deposit.`}
          </Text>

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                padding: 8,
                backgroundColor: 'white',
              }}
            >
              <QRCode
                backgroundColor="white"
                size={160}
                value={wallet.address}
                getRef={ref => (this._qrCode = ref)}
              />
            </View>

            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 12,
                marginTop: 16,
              }}
            >
              {wallet.address}
            </Text>
          </View>

          <Button
            bordered
            light
            full
            style={{
              alignSelf: 'center',
              minWidth: '50%',
            }}
            onPress={this._copyAdress}
          >
            <Text>Copy address</Text>
          </Button>

          <Button
            bordered
            light
            full
            style={{
              alignSelf: 'center',
              minWidth: '50%',
              marginTop: 16,
            }}
            disabled={loading}
            onPress={this._saveQrCode}
          >
            <Text>Save QR code</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
