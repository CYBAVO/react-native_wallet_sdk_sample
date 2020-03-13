/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { fetchBalance } from '../store/actions';

class Balance extends Component {
  componentDidMount = () => {
    this.props.fetchBalance();
  };

  _effectiveBalance = balanceItem => {
    return balanceItem.tokenBalance || balanceItem.balance || '…';
  };

  render() {
    const { balanceItem, textStyle } = this.props;
    return (
      <Text numberOfLines={1} ellipsizeMode="tail" style={textStyle}>
        {this._effectiveBalance(balanceItem)}
      </Text>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { currency, tokenAddress, address } = ownProps;
  const {
    balance: { balances = {} },
  } = state;
  const balance = balances[`${currency}#${tokenAddress}#${address}`];
  return {
    loading: !balance || balance.loading,
    balanceItem: balance || {},
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { currency, tokenAddress, address } = ownProps;
  return {
    fetchBalance: () =>
      dispatch(fetchBalance(currency, tokenAddress, address, false)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Balance);
