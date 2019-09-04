/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { fetchCurrenciesIfNeed } from '../store/actions';

class CurrencyText extends Component {
  componentDidMount = () => {
    this.props.fetchCurrenciesIfNeed();
  };

  render() {
    const {
      loading,
      currencyItem,
      currencySymbol,
      textStyle = {},
      symbol = false,
      note = false,
    } = this.props;
    return (
      <React.Fragment>
        {loading && <Text note={note}>{currencySymbol}</Text>}
        {!loading && currencyItem && (
          <Text note={note} style={textStyle}>
            {symbol ? currencyItem.symbol : currencyItem.displayName}
          </Text>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { currency, tokenAddress } = ownProps;
  return {
    loading: state.currency.loading,
    currencyItem: (state.currency.currencies || []).find(
      c => c.currency === currency && c.tokenAddress === tokenAddress
    ),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchCurrenciesIfNeed: () => dispatch(fetchCurrenciesIfNeed()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencyText);
