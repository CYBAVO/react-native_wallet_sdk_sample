import { BALANCE_ENQUEUE, BALANCE_UPDATE_BALANCES } from '../actions/balance';
import { COMMON_RESET } from '../actions/common';

const defaultState = {
  balances: {},
};

function balance(state = defaultState, action) {
  switch (action.type) {
    case COMMON_RESET: {
      return defaultState;
    }
    case BALANCE_ENQUEUE: {
      const { currency, tokenAddress, address, loading } = action;
      const key = `${currency}#${tokenAddress}#${address}`;
      const b = state.balances[key] || {
        currency,
        tokenAddress,
        address,
      };
      return {
        ...state,
        balances: {
          ...state.balances,
          [key]: {
            ...b,
            loading,
            failed: false,
          },
        },
      };
    }
    case BALANCE_UPDATE_BALANCES: {
      const { balances } = action;
      const updatedAt = Date.now();
      return {
        ...state,
        balances: {
          ...state.balances,
          // merge in new balances
          ...balances.reduce((acc, res) => {
            const { currency, tokenAddress, address, balance, failed } = res;
            const key = `${currency}#${tokenAddress}#${address}`;
            return {
              ...acc,
              [key]: {
                ...balance,
                currency,
                tokenAddress,
                address,
                updatedAt: failed ? 0 : updatedAt,
                failed,
                loading: false,
              },
            };
          }, {}),
        },
      };
    }
    default:
      return state;
  }
}

export default balance;
