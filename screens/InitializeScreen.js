import React from 'react';
import { connect } from 'react-redux';
import { Container, Spinner, Text } from 'native-base';
import { initAuth } from '../store/actions';

import { colorPrimary } from '../Constants';

class InitializeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.props.initAuth();
  }

  render() {
    return (
      <Container
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spinner size="large" color={colorPrimary} />
        <Text style={{ color: colorPrimary }}>Loading...</Text>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    signInState: state.auth.signInState,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    initAuth: () => dispatch(initAuth()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InitializeScreen);
