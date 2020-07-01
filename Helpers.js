/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import { Toast } from 'native-base';

export function toastError(error) {
  Toast.show({ text: error.message, type: 'warning', duration: 3000 });
}
export function hasValue(str) {
  return str != null && str.length > 0;
}
export function getFullName(givenName, familyName) {
  if (!hasValue(givenName) && !hasValue(familyName)) {
    return '';
  }
  const regex = /^[\u4e00-\u9eff]+$/gu;
  let m1 = givenName.match(regex);
  let m2 = familyName.match(regex);
  if (m1 && m1.length > 0 && m2 && m2.length > 0) {
    return `${familyName}${givenName}`;
  } else {
    return `${givenName} ${familyName}`;
  }
}
