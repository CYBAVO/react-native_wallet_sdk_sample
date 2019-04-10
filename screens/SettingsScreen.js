/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Alert, View } from 'react-native';
import {
  Header,
  Left,
  Icon,
  Body,
  Title,
  Right,
  Container,
  Content,
  Button,
  Text,
  ListItem,
  List,
  Thumbnail,
  Badge,
} from 'native-base';
import { WalletSdk } from '@cybavo/react-native-wallet-service';
import { signOut } from '../store/actions';
import { colorAccent, colorPrimary } from '../Constants';
import { SERVICE_API_CODE, SERVICE_ENDPOINT } from '../BuildConfig.json';

const {
  sdkInfo: { VERSION_NAME, VERSION_CODE, BUILD_TYPE },
} = WalletSdk;

const styles = StyleSheet.create({
  header: {
    color: colorAccent,
  },
  icon: {
    width: 32,
    height: 'auto',
    fontSize: 24,
    color: 'gray',
    textAlign: 'center',
  },
  dummyAvatar: {
    width: 32,
    height: 32,
    fontSize: 20,
    lineHeight: 32,
    color: 'white',
    textAlign: 'center',
    backgroundColor: colorPrimary,
    borderRadius: 16,
  },
});

class SettingsScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <Header noShadow>
        <Left>
          <Button transparent onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Settings</Title>
        </Body>
        <Right />
      </Header>
    ),
  });

  _confirmSignOut = () => {
    const { signOut } = this.props;

    Alert.alert(
      'Sign out',
      'Arare you sure you want to sign out?',
      [{ text: 'Cancel' }, { text: 'Sign out', onPress: signOut }],
      { cancelable: true }
    );
  };

  _goSetupPinCode = () => {
    const { navigation } = this.props;
    navigation.navigate('SetupPinCode');
  };

  _goSetupSecurityQuestions = () => {
    const { navigation } = this.props;
    navigation.navigate('SetupSecurityQuestions');
  };

  _goChangePinCode = () => {
    const { navigation } = this.props;
    navigation.navigate('ChangePinCode');
  };

  _goForgotPinCode = () => {
    const { navigation, userState } = this.props;
    if (userState.setSecurityQuestions) {
      navigation.navigate('VerifySecurityQuestions');
    } else {
      // have not set Security Questions yet, go recovery directly
      navigation.navigate('RecoverPinCode');
    }
  };

  render() {
    const { userState, hasWallet, identity } = this.props;

    return (
      <Container>
        <Content>
          <List>
            <ListItem itemHeader first>
              <Text style={styles.header}>Account</Text>
            </ListItem>
            <ListItem avatar>
              <Left>
                {!!identity.avatar && (
                  <Thumbnail small source={{ uri: identity.avatar }} />
                )}
                {!identity.avatar && (
                  <Text style={styles.dummyAvatar}>
                    {!!userState.realNme ? userState.realNme[0] : '?'}
                  </Text>
                )}
              </Left>
              <Body>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Badge success style={{ marginRight: 4 }}>
                    <Text>{identity.provider}</Text>
                  </Badge>
                  <Text numberOfLines={1} ellipsizeMode="middle">
                    {userState.realName}
                  </Text>
                </View>
                {!!userState.email && (
                  <Text note numberOfLines={1} ellipsizeMode="middle">
                    {userState.email}
                  </Text>
                )}
              </Body>
              <Right>
                <Button
                  transparent
                  primary
                  small
                  onPress={this._confirmSignOut}
                >
                  <Text>SIGN OUT</Text>
                </Button>
              </Right>
            </ListItem>

            <ListItem itemHeader>
              <Text style={styles.header}>Security</Text>
            </ListItem>
            {/* set pin */}
            {!userState.setPin && (
              <ListItem avatar button onPress={this._goSetupPinCode}>
                <Left>
                  <Icon
                    name="color-wand"
                    style={[styles.icon, { color: colorAccent }]}
                  />
                </Left>
                <Body>
                  <Text style={{ color: colorAccent }}>Setup PIN code</Text>
                  <Text note style={{ color: colorAccent, opacity: 0.75 }}>
                    Finish setup by creating your PIN code
                  </Text>
                </Body>
              </ListItem>
            )}
            {/* Setup/Change securiry question -- must has a wallet */}
            {hasWallet && (
              <ListItem avatar button onPress={this._goSetupSecurityQuestions}>
                <Left>
                  <Icon name="help-buoy" style={styles.icon} />
                </Left>
                <Body>
                  <Text>
                    {userState.setSecurityQuestions
                      ? 'Change security questions'
                      : 'Setup security questions'}
                  </Text>
                  <Text note>
                    Security questions is required when PIN code restoration
                  </Text>
                </Body>
              </ListItem>
            )}
            {/* change PIN code with current PIN code -- must has PIN code */}
            {userState.setPin && (
              <>
                <ListItem avatar button onPress={this._goChangePinCode}>
                  <Left>
                    <Icon name="refresh" style={styles.icon} />
                  </Left>
                  <Body>
                    <Text>Change PIN code</Text>
                    <Text note>Change your PIN code to another one</Text>
                  </Body>
                </ListItem>
              </>
            )}
            {userState.setPin && (
              <ListItem avatar button onPress={this._goForgotPinCode}>
                <Left>
                  <Icon name="lock" style={styles.icon} />
                </Left>
                <Body>
                  <Text>Forgot PIN code</Text>
                  <Text note>
                    Restore your PIN code by answering security questions
                  </Text>
                </Body>
              </ListItem>
            )}
            <ListItem itemHeader>
              <Text style={styles.header}>Development</Text>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Icon name="md-cloud" style={styles.icon} />
              </Left>
              <Body>
                <Text>Wallet service endpoint</Text>
                <Text note>{SERVICE_ENDPOINT}</Text>
              </Body>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Icon name="md-code" style={styles.icon} />
              </Left>
              <Body>
                <Text>Wallet service API code</Text>
                <Text note>{SERVICE_API_CODE}</Text>
              </Body>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Icon name="md-bug" style={styles.icon} />
              </Left>
              <Body>
                <Text>Wallet SDK version</Text>
                <Text
                  note
                >{`${VERSION_NAME} (${VERSION_CODE}) - ${BUILD_TYPE}`}</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userState: state.user.userState,
    signInState: state.auth.signInState,
    identity: state.auth.identity,
    hasWallet: state.wallets.wallets && state.wallets.wallets.length > 0,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    signOut: () => dispatch(signOut()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
