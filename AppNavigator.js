import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import InitializeScreen from './screens/InitializeScreen';
import MainScreen from './screens/MainScreen';
import SignInScreen from './screens/SignInScreen';
import SetupPinCodeScreen from './screens/SetupPinCodeScreen';
import CreateWalletScreen from './screens/CreateWalletScreen';
import SettingsScreen from './screens/SettingsScreen';
import WalletDetailScreen from './screens/WalletDetailScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import DepositScreen from './screens/DepositScreen';
import WithdrawScreen from './screens/WithdrawScreen';
import ScanScreen from './screens/ScanScreen';
import SetupSecurityQuestionsScreen from './screens/SetupSecurityQuestionsScreen';
import ChangePinCodeScreen from './screens/ChangePinCodeScreen';
import VerifySecurityQuestionsScreen from './screens/VerifySecurityQuestionsScreen';
import RestorePinCodeScreen from './screens/RestorePinCodeScreen';
import RecoverPinCodeScreen from './screens/RecoverPinCodeScreen';
import ResetPinCodeScreen from './screens/ResetPinCodeScreen';
import SessionExpiredScreen from './screens/SessionExpiredScreen';

const MainStack = createStackNavigator({
  Main: MainScreen,
  // Setup
  SetupPinCode: SetupPinCodeScreen,
  SetupSecurityQuestions: SetupSecurityQuestionsScreen,

  // Create Wallet
  CreateWallet: CreateWalletScreen,

  // Wallet Detail
  WalletDetail: WalletDetailScreen,
  TransactionDetail: TransactionDetailScreen,
  Deposit: DepositScreen,
  Withdraw: WithdrawScreen,
  Scan: ScanScreen,

  // Settings
  Settings: SettingsScreen,

  // Change PIN code
  ChangePinCode: ChangePinCodeScreen,
  // Restore PIN code
  VerifySecurityQuestions: VerifySecurityQuestionsScreen,
  RestorePinCode: RestorePinCodeScreen,
  // Recover PIN code
  RecoverPinCode: RecoverPinCodeScreen,
  ResetPinCode: ResetPinCodeScreen,
});

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(
  createSwitchNavigator(
    {
      Init: InitializeScreen,
      Main: MainStack,
      Auth: AuthStack,
      SessionExpired: SessionExpiredScreen,
    },
    {
      initialRouteName: 'Init',
    }
  )
);
