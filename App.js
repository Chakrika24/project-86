import * as React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SignUpLoginScreen from './screens/SignUpLoginScreen';
import { AppTabNavigator } from './components/AppTabNavigator';
import { AppDrawerNavigator } from './components/AppDrawerNavigator';


export default function App() {
  return (
    <AppContainer/>
  );
}

const switchNavigator = createSwitchNavigator({
   SignUpLoginScreen : {screen: SignUpLoginScreen},
    Drawer: { screen: AppDrawerNavigator },
   BottomTab:{screen: AppTabNavigator}
})

const AppContainer =  createAppContainer(switchNavigator);