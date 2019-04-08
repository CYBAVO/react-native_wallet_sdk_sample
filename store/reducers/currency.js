/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import {
  CURRENCIES_LOADING,
  CURRENCIES_ERROR,
  CURRENCIES_UPDATE_CURRENCIES,
} from '../actions/currency';

function currency(
  state = {
    loading: false,
    error: null,
    currencies: null,
  },
  action
) {
  switch (action.type) {
    case CURRENCIES_LOADING:
      return {
        ...state,
        loading: action.loading,
        error: null,
      };
    case CURRENCIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case CURRENCIES_UPDATE_CURRENCIES:
      return {
        ...state,
        currencies: action.currencies,
        error: null,
      };
    default:
      return state;
  }
}

export default currency;
