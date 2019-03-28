import { Wallets } from '@cybavo/react-native-wallet-service';

export const WALLETS_LOADING = 'WALLETS_LOADING';
export const WALLETS_UPDATE_WALLET_LIST = 'WALLETS_UPDATE_WALLET_LIST';
export const WALLETS_UPDATE_WALLET = 'WALLETS_UPDATE_WALLET';
export const WALLETS_ERROR = 'WALLETS_ERROR';

export function fetchWallets() {
  return async dispatch => {
    dispatch({ type: WALLETS_LOADING, loading: true });
    try {
      const { wallets } = await Wallets.getWallets();
      dispatch({ type: WALLETS_UPDATE_WALLET_LIST, wallets });
    } catch (error) {
      console.log('Wallets.getWallets failed', error);
      dispatch({ type: WALLETS_ERROR, error });
    }
    dispatch({ type: WALLETS_LOADING, loading: false });
  };
}

export function fetchWallet(walletId) {
  return async dispatch => {
    dispatch({ type: WALLETS_LOADING, loading: true });
    try {
      const { wallet } = await Wallets.getWallet(walletId);
      dispatch({ type: WALLETS_UPDATE_WALLET, walletId, wallet });
    } catch (error) {
      console.log('Wallets.getWallet failed', walletId, error);
      dispatch({ type: WALLETS_ERROR, error });
    }
    dispatch({ type: WALLETS_LOADING, loading: false });
  };
}
