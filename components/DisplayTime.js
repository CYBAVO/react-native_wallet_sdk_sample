/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { Text } from 'native-base';
import moment from 'moment';

export default class DisplayTime extends Component {
  _displayTime = () => {
    const { unix, format } = this.props;
    if (!unix || unix === -1) {
      return '-';
    }
    const parsed = moment.unix(unix);

    return parsed.format(format || 'YYYY-MM-DD HH:mm:ss');
  };

  render() {
    const { textStyle = {} } = this.props;
    return <Text style={textStyle}>{this._displayTime()}</Text>;
  }
}
