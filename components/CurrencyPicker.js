/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { Picker } from 'native-base';

class CurrencyPicker extends Component {
  _onValueChanged = value => {
    const { currencies, onValueChange } = this.props;
    const selected = currencies.find(
      currency => `${currency.currency}#${currency.tokenAddress}` === value
    );
    onValueChange(selected);
  };

  render() {
    const { currencies = [], selected, enabled } = this.props;
    return (
      <Picker
        mode="dropdown"
        style={{ width: '100%' }}
        enabled={enabled}
        selectedValue={`${selected.currency}#${selected.tokenAddress}`}
        onValueChange={this._onValueChanged}
      >
        {currencies.map(currency => (
          <Picker.Item
            key={`${currency.currency}#${currency.tokenAddress}`}
            label={`${currency.symbol} - ${currency.displayName}`}
            value={`${currency.currency}#${currency.tokenAddress}`}
          />
        ))}
      </Picker>
    );
  }
}

export default CurrencyPicker;
