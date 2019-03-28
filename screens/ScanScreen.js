import React, { Component } from 'react';
import {
  Container,
  Button,
  Header,
  Left,
  Body,
  Right,
  Icon,
  Title,
} from 'native-base';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { colorPrimary, colorAccent } from '../Constants';

export default class ScanScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header
        noShadow
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" style={{ color: colorPrimary }} />
          </Button>
        </Left>
        <Body>
          <Title style={{ color: colorPrimary }}>Scan QR Code</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  _scanComplete = data => {
    const { navigation } = this.props;
    if (navigation.state.params.onResult) {
      navigation.state.params.onResult(data);
    }
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container>
        <QRCodeScanner
          showMarker
          checkAndroid6Permissions
          cameraProps={{
            style: {
              width: '100%',
              height: '100%',
            },
          }}
          markerStyle={{
            borderColor: colorAccent,
          }}
          onRead={({ data }) => this._scanComplete(data)}
        />
      </Container>
    );
  }
}
