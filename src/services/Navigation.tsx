
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import loginComponent from '../pages/login';
import App from '../pages/main';
import InitComponent from '../pages/init';
import BannersComponent from '../pages/banners';
import MaestroHomeComponent from '../pages/maestros/home_maestro';
import CargaMasivaComponent from '../pages/maestros/cargaMasiva';
import OrdenCompraComponent from '../pages/maestros/oc';
import TutorHomeComponent from '../pages/tutor/tutor_maestro';
import MonitorComponent from '../pages/monitor/monitor';
import Anexos from '../components/anexos/anexos';
import FilesComponent from '../components/anexos/anexos_list';

import  OpenProgram  from '../components/tools/openProgram';



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
          <Stack.Screen name="Compra" component={OrdenCompraComponent} options={{title:''}} />
          <Stack.Screen name="Anexos" component={Anexos} />
          <Stack.Screen name="Mis_Anexos" component={FilesComponent} />
          <Stack.Screen name="Program" component={OpenProgram} />
        </Stack.Navigator>
      </NavigationContainer>
    );
    
}

export default Navigation;