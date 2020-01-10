/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Button, Text, Body, Card, CardItem } from 'native-base';
import Modal from 'react-native-modal';
import { NumericPinCodeInputView } from '@cybavo/react-native-wallet-service';
import { colorAccent, PIN_CODE_LENGTH } from '../Constants';

export default class InputPinCodeModal extends Component {
  state = {
    pinCodeLength: 0,
  };

  _inputPinCode = pinCodeLength => {
    this.setState({ pinCodeLength });
  };

  _submit = async () => {
    const { onInputPinCode } = this.props;
    if (!onInputPinCode) {
      return;
    }

    try {
      const pinSecret = await this.refs.pinCodeInput.submit();
      onInputPinCode(pinSecret);
    } catch (error) {
      console.warn(error);
    }
  };

  render() {
    const { pinCodeLength } = this.state;
    const { isVisible, onCancel, loading } = this.props;
    const isValid = pinCodeLength === PIN_CODE_LENGTH;
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={onCancel}
        onBackButtonPress={onCancel}
      >
        <Card>
          <CardItem header>
            <Text>Input PIN Code</Text>
          </CardItem>
          <CardItem>
            <Body>
              <View
                style={{
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 32,
                    textAlign: 'center',
                    letterSpacing: 16,
                  }}
                >
                  {`${'*'.repeat(pinCodeLength)}${'-'.repeat(
                    PIN_CODE_LENGTH - pinCodeLength
                  )}`}
                </Text>
                {loading && (
                  <ActivityIndicator
                    color={colorAccent}
                    size="small"
                    style={{
                      position: 'absolute',
                      right: 16,
                    }}
                  />
                )}
              </View>
              <NumericPinCodeInputView
                ref="pinCodeInput"
                style={{
                  alignSelf: 'center',
                  marginTop: 16,
                }}
                maxLength={PIN_CODE_LENGTH}
                hapticFeedback={true}
                horizontalSpacing={16}
                verticalSpacing={8}
                buttonWidth={72}
                buttonHeight={72}
                buttonBorderRadius={36}
                buttonBackgroundColor="#EEEEEE80"
                buttonTextColor="black"
                buttonTextSize={12}
                backspaceButtonWidth={72}
                backspaceButtonHeight={72}
                backspaceButtonBorderRadius={36}
                backspaceButtonBackgroundColor="#EEEEEE80"
                buttonBackgroundColorDisabled="#EEEEEE"
                backspaceButtonTextColor="black"
                buttonTextColorDisabled="black"
                backspaceButtonTextColorDisabled="black"
                backspaceButtonTextSize={12}
                backspaceButtonBackgroundColorDisabled="#EEEEEE"
                androidButtonRippleColor="#80808080"
                disabled={loading}
                onChanged={this._inputPinCode}
              />
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
              onPress={this._submit}
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
