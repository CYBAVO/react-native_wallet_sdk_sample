import { Wallets } from '@cybavo/react-native-wallet-service';

export const BALANCE_ENQUEUE = 'BALANCE_ENQUEUE';
export const BALANCE_UPDATE_BALANCES = 'BALANCE_UPDATE_BALANCES';

const BALANCE_THROTTLE = 10 * 1000; // 10 sec
const BALANCE_ENQUEUE_DELAY = 500; // 0.5 sec

function shouldFetchBalance(currency, tokenAddress, address, state) {
  const key = `${currency}#${tokenAddress}#${address}`;
  const balance = state.balance.balances[key];
  if (!balance) {
    // not exist
    return true;
  }
  if (balance.loading) {
    // already loading
    return false;
  }

  if (!balance.updatedAt) {
    // no time for some how
    return true;
  }
  // expired
  return Date.now() - balance.updatedAt > BALANCE_THROTTLE;
}

export function fetchBalance(currency, tokenAddres, address, refresh) {
  return async (dispatch, getState) => {
    if (
      refresh ||
      shouldFetchBalance(currency, tokenAddres, address, getState())
    ) {
      return dispatch(enqueueBalance(currency, tokenAddres, address));
    }
  };
}

let timeOut = null;
function enqueueBalance(currency, tokenAddress, address) {
  return dispatch => {
    dispatch({
      type: BALANCE_ENQUEUE,
      currency,
      tokenAddress,
      address,
      loading: true,
    });
    if (!timeOut) {
      timeOut = setTimeout(() => {
        timeOut = null;
        dispatch(fetchBalancesBatch());
      }, BALANCE_ENQUEUE_DELAY);
    }
  };
}

function fetchBalancesBatch() {
  return async (dispatch, getState) => {
    const batch = Object.values(getState().balance.balances).filter(
      b => b.loading
    );
    try {
      const result = await Wallets.getBalances(batch);
      const balances = batch.map(({ currency, tokenAddress, address }, i) => {
        const res = result[i];
        return {
          currency,
          tokenAddress,
          address,
          balance: res || {},
          failed: !res,
        };
      });
      dispatch({ type: BALANCE_UPDATE_BALANCES, balances });
    } catch (error) {
      console.log('Wallets.getBalances failed', batch, error);
    }
  };
}
