import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem, Text, Icon, Left, Right, Body } from 'native-base';
import CurrencyText from './CurrencyText';
import CurrencyIcon from './CurrencyIcon';
import Balance from './Balance';
import { colorPrimary } from '../Constants';

export default class WalletList extends Component {
  _renderItem = ({ item }) => {
    const { onWalletPress } = this.props;
    return (
      <ListItem avatar button onPress={() => onWalletPress(item)}>
        <Left>
          <CurrencyIcon currencySymbol={item.currencySymbol} dimension={36} />
        </Left>
        <Body>
          <Text>{item.name}</Text>
          <CurrencyText note {...item} />
        </Body>
        <Right style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Balance
            textStyle={{
              fontSize: 14,
              color: colorPrimary,
              textAlign: 'right',
              marginHorizontal: 16,
            }}
            {...item}
          />
          <Icon name="ios-arrow-forward" />
        </Right>
      </ListItem>
    );
  };

  render() {
    const { wallets, onRefresh, refreshing } = this.props;
    return (
      <FlatList
        data={wallets}
        keyExtractor={wallet => `${wallet.walletId}`}
        renderItem={this._renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  }
}
