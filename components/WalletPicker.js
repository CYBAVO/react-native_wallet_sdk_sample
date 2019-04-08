/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { Picker } from 'native-base';

class WalletPicker extends Component {
  render() {
    const { wallets = [], selected = -1, enabled, onValueChange } = this.props;
    return (
      <Picker
        mode="dropdown"
        style={{ width: '100%' }}
        enabled={enabled}
        selectedValue={selected}
        onValueChange={onValueChange}
      >
        {wallets.map((wallet, i) => (
          <Picker.Item
            key={i}
            label={`${wallet.currencySymbol} - ${wallet.name}`}
            value={i}
          />
        ))}
      </Picker>
    );
  }
}

export default WalletPicker;
