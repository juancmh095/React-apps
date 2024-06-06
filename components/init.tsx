import { ActivityIndicator, ImageBackground, StyleSheet, ToastAndroid, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";

import * as rqdata from './params_request';
import storage from "../Storage";


const InitComponent = ({navigation}) => {
    const formikRef = useRef();
    const [textinit, setExtInit] = React.useState('Bienvenido');
    const [usuario, setUsuario] = React.useState(null);
    const url_api = "http://20.64.97.37/api/products";


    useEffect(()=> {
        barLogin();
        validateUser();
        if(usuario){
        }
    })

    const barLogin = async () => {
        console.log('xxxx',rqdata.bottomBarLogin);
        var reponse = await axios.post(`${url_api}`,rqdata.bottomBarLogin);
        if(reponse.data.Json){
        }
    }

    const validateUser = async () => {
        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            setUsuario(res[0]);
            
        });
    }

    const closeApp = async () => {
        storage.clearMap();
        navigation.navigate('Login');
    }
   
  return (
    <View style={{height:'100%'}}>
        <ImageBackground source={(usuario?usuario['FondoPantalla']:'')}>
            <View>
                {/* <Image
                    source={{ uri: (usuario?usuario['Icono']:'https://templates.iqonic.design/instadash/intro/dist/assets/images/logo.png') }}
                /> */}
                <Text>{JSON.stringify(usuario)} </Text>
                <Image
                    style={{
                        width:200,
                        height:50,
                        marginLeft:'auto',
                        marginRight:'auto',
                        marginTop:50,
                        marginBottom:60
                    }}
                    source={require('../assets/logo.png')}
                />
                <Text style={{fontSize:25, fontWeight:600, textAlign:'center' }}>¡Hola {usuario?usuario['ESNOMBRECOR']:''}!</Text>
                <Text style={{fontSize:18, fontWeight:600, textAlign:'center' }}>*{usuario?usuario['ususer']:''}</Text>
            </View>
            <View style={{marginTop:60}}>
                <Button
                    title="Continuar"
                    iconContainerStyle={{ marginRight: 10 }}
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={{
                        backgroundColor: 'red',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 30,
                    }}
                    containerStyle={{
                        width: 200,
                        marginHorizontal: "auto",
                        marginVertical: "auto",
                        marginLeft:"auto",
                        marginRight:"auto"
                    }}
                    onPress={()=> navigation.navigate('Banners')}
                    />
                <Button
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                    marginLeft:"auto",
                    marginRight:"auto"
                }}
                title="Cerrar Sesion"
                type="clear"
                titleStyle={{ color: 'rgba(78, 116, 289, 1)' }}
                onPress={()=> closeApp()}
                />
            </View>
        </ImageBackground>
    </View>
    
  );
}




export default InitComponent;