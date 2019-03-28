import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Text, Body, Card, CardItem, Item, Input } from 'native-base';
import Modal from 'react-native-modal';
import { colorAccent, PIN_CODE_LENGTH } from '../Constants';

export default class InputPinCodeModal extends Component {
  state = {
    pinCode: '',
  };

  _reset = () => {
    this.setState({ pinCode: '' });
  };

  render() {
    const { pinCode } = this.state;
    const { isVisible, onCancel, loading, onInputPinCode } = this.props;
    const isValid = pinCode.length === PIN_CODE_LENGTH;
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onCancel}
        onBackButtonPress={onCancel}
        onModalWillHide={this._reset}
      >
        <Card>
          <CardItem header>
            <Text>Input PIN Code</Text>
          </CardItem>
          <CardItem>
            <Body>
              <Item regular>
                <Input
                  autoFocus
                  secureTextEntry
                  maxLength={PIN_CODE_LENGTH}
                  keyboardType="number-pad"
                  value={pinCode}
                  editable={!loading}
                  onChangeText={pinCode => this.setState({ pinCode })}
                />
                {loading && (
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
            <Button transparent onPress={onCancel} disabled={loading}>
              <Text>Cancel</Text>
            </Button>
            <Button
              transparent
              onPress={() => onInputPinCode(pinCode)}
              disabled={loading || !isValid}
            >
              <Text>Submit</Text>
            </Button>
          </CardItem>
        </Card>
      </Modal>
    );
  }
}
