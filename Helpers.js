import { Toast } from 'native-base';

export function toastError(error) {
  Toast.show({ text: error.message, type: 'warning', duration: 3000 });
}
