import { Wallets } from '@cybavo/react-native-wallet-service';

export const CURRENCIES_LOADING = 'CURRENCIES_LOADING';
export const CURRENCIES_UPDATE_CURRENCIES = 'CURRENCIES_UPDATE_CURRENCIES';
export const CURRENCIES_ERROR = 'CURRENCIES_ERROR';

function shouldFetchCurrency(state) {
  return !state.currency.currencies && !state.currency.loading; // no currency and not loading
}

export function fetchCurrenciesIfNeed() {
  return async (dispatch, getState) => {
    if (shouldFetchCurrency(getState())) {
      return dispatch(fetchCurrencies());
    }
  };
}

function fetchCurrencies() {
  return async dispatch => {
    dispatch({ type: CURRENCIES_LOADING, loading: true });
    try {
      const { currencies } = await Wallets.getCurrencies();
      dispatch({ type: CURRENCIES_UPDATE_CURRENCIES, currencies });
    } catch (error) {
      console.warn('Wallets.getCurrencies failed', error);
      dispatch({ type: CURRENCIES_ERROR, error });
    }
    dispatch({ type: CURRENCIES_LOADING, loading: false });
  };
}
