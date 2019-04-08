/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { Image } from 'react-native';

const ICONS = {
  BCH: require('../assets/image/bch.png'),
  BTC: require('../assets/image/btc.png'),
  EOS: require('../assets/image/eos.png'),
  ETH: require('../assets/image/eth.png'),
  GUSD: require('../assets/image/gusd.png'),
  LTC: require('../assets/image/ltc.png'),
  PAX: require('../assets/image/pax.png'),
  TRX: require('../assets/image/trx.png'),
  TUSD: require('../assets/image/tusd.png'),
  USDC: require('../assets/image/usdc.png'),
  'USDT-ERC20': require('../assets/image/usdt_erc20.png'),
  'USDT-Omni': require('../assets/image/usdt_omni.png'),
  XRP: require('../assets/image/xrp.png'),
};

const UNKNOWN = require('../assets/image/currency_unknown.png');

class CurrencyIcon extends Component {
  render() {
    const { currencySymbol, dimension = 24 } = this.props;
    const icon = ICONS[currencySymbol] || UNKNOWN;
    return (
      <Image
        source={icon}
        resizeMode="contain"
        style={{ width: dimension, height: dimension }}
      />
    );
  }
}

export default CurrencyIcon;
