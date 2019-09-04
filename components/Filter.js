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
    borderWidth: 1,
    color: colorPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  filterActive: {
    backgroundColor: colorPrimary,
    color: 'white',
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
