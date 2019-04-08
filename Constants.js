/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
export const Coin = {
  BTC: 0,
  LTC: 2,
  ETH: 60,
  XRP: 144,
  BCH: 145,
  EOS: 194,
  TRX: 195,
};

const TX_EXPLORER_URIS = {
  [`${Coin.BTC}#`]: 'https://blockexplorer.com/tx/%s', // BTC
  [`${Coin.BTC}#31`]: 'https://omniexplorer.info/tx/%s', // USDT-Omni
  [`${Coin.LTC}#`]: 'https://live.blockcypher.com/ltc/tx/%s', // LTC
  [`${Coin.ETH}#`]: 'https://etherscan.io/tx/%s', // ETH
  [`${Coin.XRP}#`]: 'https://xrpcharts.ripple.com/#/transactions/%s', // XRP
  [`${Coin.BCH}#`]: 'https://explorer.bitcoin.com/bch/tx/%s', // BCH
  [`${Coin.EOS}#`]: 'https://eosflare.io/tx/%s', // EOS
  [`${Coin.TRX}#`]: 'https://tronscan.org/#/transaction/%s', // TRX
};

export const getTransactionExplorerUri = ({ currency, tokenAddress, txid }) => {
  const template = TX_EXPLORER_URIS[`${currency}#${tokenAddress}`];
  if (!template) {
    return null;
  }
  return template.replace('%s', txid);
};

export const colorPrimary = '#3F51B5';
export const colorPrimaryDark = '#303F9F';
export const colorAccent = '#FF4081';
export const colorDanger = '#D9534F';

export const PIN_CODE_LENGTH = 6;
