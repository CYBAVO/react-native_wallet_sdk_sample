/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import { colorPrimary } from '../Constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  filter: {
    borderColor: colorPrimary,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    color: colorPrimary,
    paddingHorizontal: 8,
    paddingVertical: 8,
    minWidth: 80,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterActive: {
    backgroundColor: colorPrimary,
    color: 'white',
  },
  first: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderLeftWidth: 1,
  },
  last: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderLeftWidth: 0,
  },
});

export default class Filter extends Component {
  render() {
    const { options = [], selected, onChange, containerStyle } = this.props;
    return (
      <View style={[styles.filterRow, containerStyle]}>
        {options.map((opt, idx) => (
          <TouchableWithoutFeedback key={idx} onPress={() => onChange(idx)}>
            <Text
              style={[
                styles.filter,
                idx === selected ? styles.filterActive : {},
                idx === 0 ? styles.first : {},
                idx === options.length - 1 ? styles.last : {},
              ]}
            >
              {opt}
            </Text>
          </TouchableWithoutFeedback>
        ))}
      </View>
    );
  }
}
