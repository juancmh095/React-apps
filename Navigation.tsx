
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import loginComponent from './components/login';
import App from './components/main';
import storage from './Storage';


const Stack = createNativeStackNavigator();

function Navigation() {
    
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={loginComponent} />
          <Stack.Screen name="Home" component={App} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    
}

export default Navigation;