import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import AppNavigator from './AppNavigator';
import NavigationService from './NavigationService';
import { Root } from 'native-base';
import { PersistGate } from 'redux-persist/integration/react';

export default class AppWrapper extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Root>
            <AppNavigator
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }}
            />
          </Root>
        </PersistGate>
      </Provider>
    );
  }
}
