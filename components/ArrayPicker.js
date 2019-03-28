import React, { Component } from 'react';
import { Picker } from 'native-base';

class ArrayPicker extends Component {
  render() {
    const { options = [], selected = {}, enabled, onValueChange } = this.props;
    return (
      <Picker
        mode="dropdown"
        style={{ flex: 1 }}
        enabled={enabled}
        selectedValue={selected}
        onValueChange={onValueChange}
      >
        {options.map((opt, index) => (
          <Picker.Item key={index} label={opt} value={opt} />
        ))}
      </Picker>
    );
  }
}

export default ArrayPicker;
