import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Text, Button, Icon, View } from 'native-base';
import { signOut } from '../store/actions';
import { colorPrimary } from '../Constants';

class SessionExpiredScreen extends Component {
  static navigationOptions = { header: null };

  _restore = () => {
    this.props.signOut();
  };

  render() {
    return (
      <Container
        style={{
          backgroundColor: colorPrimary,
          padding: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name="moon"
            style={{
              fontSize: 128,
              color: 'white',
              opacity: 0.5,
            }}
          />
          <Text
            style={{
              color: 'white',
              opacity: 0.5,
              fontSize: 20,
            }}
          >
            Session expired.
          </Text>
        </View>
        <Button transparent full onPress={this._restore}>
          <Text style={{ color: 'white' }}>Sign in again</Text>
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    userState: state.user.userState,
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
)(SessionExpiredScreen);
