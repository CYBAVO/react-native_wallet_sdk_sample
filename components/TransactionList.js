/**
 * Copyright (c) 2019 CYBAVO, Inc.
 * https://www.cybavo.com
 *
 * All rights reserved.
 */
import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { ListItem, Text, Badge, Icon, Body, Left, Right } from 'native-base';
import DisplayTime from './DisplayTime';
import { colorPrimary, colorDanger } from '../Constants';

export default class TransactionList extends Component {
  _renderItem = ({ item }) => {
    const { onTransactionPress, wallet } = this.props;
    return (
      <ListItem
        style={{ opacity: item.pending ? 0.5 : 1 }}
        avatar
        button
        onPress={() => onTransactionPress(item)}
      >
        <Left>
          {!item.success && (
            <Icon
              style={{
                color: colorDanger,
                marginEnd: 8,
              }}
              name="warning"
            />
          )}
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <>
              {item.fromAddress === wallet.address && (
                <Badge warning>
                  <Text>WITHDRAW</Text>
                </Badge>
              )}
              {item.fromAddress !== wallet.address && (
                <Badge success>
                  <Text>DEPOSIT</Text>
                </Badge>
              )}
            </>
            <DisplayTime
              textStyle={{
                fontSize: 12,
                color: colorPrimary,
              }}
              format="YYYY/MM/DD"
              unix={item.timestamp}
            />
          </View>
        </Left>
        <Body
          style={{
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'right' }}>{item.amount}</Text>
            {!!item.platformFee && (
              <Text style={{ opacity: 0.5 }}>(Pl. Fee)</Text>
            )}
          </View>
          <Text
            note
            numberOfLines={1}
            ellipsizeMode="middle"
            style={{
              textDecorationLine: item.dropped ? 'line-through' : 'none',
            }}
          >
            {item.txid}
          </Text>
        </Body>
        <Right style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="ios-arrow-forward" />
        </Right>
      </ListItem>
    );
  };

  render() {
    const {
      transactions,
      onRefresh,
      refreshing,
      onEndReached,
      containerStyle,
    } = this.props;
    return (
      <FlatList
        style={containerStyle}
        data={transactions}
        keyExtractor={(tx, idx) => `${tx.txid}#${idx}`}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        renderItem={this._renderItem}
      />
    );
  }
}
