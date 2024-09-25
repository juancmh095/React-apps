import { ActivityIndicator, ImageBackground, StyleSheet, ToastAndroid, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";

import  {default as _apiServices} from '../components/tools/api';

import * as rqdata from '../components/tools/params_request';
import storage from "../services/Storage";
import AsyncStorage from "@react-native-async-storage/async-storage";


const InitComponent = ({navigation}) => {
    const formikRef = useRef();
    const [textinit, setExtInit] = React.useState('Bienvenido');
    const [usuario, setUsuario] = React.useState(null);
    const [labels, setLabels] = React.useState({});
    const url_api = "http://20.64.97.37/api/products";


    useEffect(()=> {
        barLogin();
        validateUser();
        getLabels();
        if(usuario){
        }
    },[])

    const barLogin = async () => {
        console.log('xxxx',rqdata.bottomBarLogin);
        var reponse = await axios.post(`${url_api}`,rqdata.bottomBarLogin);
        if(reponse.data.Json){
        }
    }

    const getLabels =  async ()=>{
        var idioma = await AsyncStorage.getItem('idioma');
        const response = await _apiServices('program','','LABELS',[{action:"I",Data:"POSTLOGIN|"+idioma+"|"}],{},'Mi App','0');
        if(response.length > 0){
            setLabels({...response[0]})
        }
    }

    const validateUser = async () => {
        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            setUsuario(res[0]);
            console.log(res[0]);
            
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
                /> *}
                {/* <Text>{JSON.stringify(usuario)} </Text> */}
                <Image
                    style={{
                        width:200,
                        height:50,
                        marginLeft:'auto',
                        marginRight:'auto',
                        marginTop:50,
                        marginBottom:60
                    }}
                    source={{uri: usuario?usuario['Icono']:''}}
                />
                <Text style={{fontSize:25, fontWeight:600, textAlign:'center' }}>¡{labels['METITLE']?labels['METITLE']:'-'} {usuario?usuario['Nombre']:''}!</Text>
                <Text style={{fontSize:18, fontWeight:600, textAlign:'center' }}>*{usuario?usuario['ususer']:''}</Text>
            </View>
            <View style={{marginTop:60}}>
                <Button
                    title={labels['MEOK']?labels['MEOK']:'-'}
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
                    onPress={()=> {
                        //navigation.navigate('Program')
                        if(usuario['usrol'] == '2'){
                            navigation.navigate('Tutor/Inicio')
                        }else{
                            if(usuario['usrol'] == '4'){
                                navigation.navigate('Monitor')
                            }else{
                                navigation.navigate('Maestro/Inicio')
                                //navigation.navigate('Compra')
                            }
                        }
                    }}
                    />
                <Button
                containerStyle={{
                    width: 200,
                    marginHorizontal: 50,
                    marginVertical: 10,
                    marginLeft:"auto",
                    marginRight:"auto"
                }}
                title={labels['MECANCEL']?labels['MECANCEL']:'-'}
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