
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import loginComponent from './components/login';
import App from './components/main';
import InitComponent from './components/init';
import BannersComponent from './components/banners';
import MaestroHomeComponent from './components/maestros/home_maestro';
import CargaMasivaComponent from './components/maestros/cargaMasiva';
import OrdenCompraComponent from './components/maestros/oc';
import TutorHomeComponent from './components/tutor/tutor_maestro';
import MonitorComponent from './components/monitor/monitor';



const Stack = createNativeStackNavigator();

function Navigation() {
    
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={loginComponent} />
          <Stack.Screen name="Home" component={App} options={{title:''}}/>
          <Stack.Screen name="Init" component={InitComponent} options={{title:''}}/>
          <Stack.Screen name="Banners" component={BannersComponent} />
          <Stack.Screen name="Maestro/Inicio" component={MaestroHomeComponent} />
          <Stack.Screen name="Carga" title="" component={CargaMasivaComponent} />
          <Stack.Screen name="Tutor/Inicio" component={TutorHomeComponent} />
          <Stack.Screen name="Monitor" component={MonitorComponent} />
          <Stack.Screen name="Compra" component={OrdenCompraComponent} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    
}

export default Navigation;