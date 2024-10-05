
import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, getCameraDevice, CodeScanner } from "react-native-vision-camera";
import { Button, Text } from "react-native-elements";
import axios from "axios";

import  {default as _apiServices} from '../../tools/api';
import AsyncStorage from "@react-native-async-storage/async-storage";


const QRComponent = ({setModalVisible, req}) => {
    const devices = Camera.getAvailableCameraDevices()
    const device = getCameraDevice(devices, 'back')    
    const [restult, setResult] = React.useState('')
    const _api = 'http://20.64.97.37/api/products';
    useEffect(() => {
        checkPermission();
    });
    

    const checkPermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission();
        const newMicrophonePermission = await Camera.requestMicrophonePermission();
        console.log(newCameraPermission,'permiso');
    }
    console.log(device);
    if(device == null) return <ActivityIndicator />
    
    const codeScanner: CodeScanner = {
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            console.log(codes[0].value); 
            setResult(codes[0].value);
        }
      }

    const SendQR = async()=>{

          var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
          usuario = JSON.parse(usuario);

          var dataRoute = req['params'];
          var params = usuario['usukides']+'|'+dataRoute['Programa']+'|'+dataRoute['params']+'|'+restult+'|'+'QR|';
          var reponse = await _apiServices('FANEXO','Mi Appescolar','WriteAtach',params,'','Utilerias','0');
          console.log(reponse);

          if(reponse[0] == 'OK'){
            showToast('Guardado satisfactoriamente')
            setResult(null)
            setModalVisible(false);
          } else {
            showToast('Error al guardar')
          }
    }

    const showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
      };
 
  return (
    <View style={{marginTop:'auto', width:'70%', height:'80%', marginStart:'auto', marginEnd:'auto'}}>
            <Camera
                style={{width:'100%',height:'90%', marginStart:'auto', marginEnd:'auto'}}
                isActive={true}
                device={device}
                codeScanner={codeScanner}
            />
            <Text
                style={{marginTop:10, fontSize:20, fontWeight:900, textAlign:'center'}}
            >Resultado: <Text style={{fontSize:15}}>{restult}</Text></Text>
            
            <Button title='Enviar' onPress={()=> SendQR()}></Button>
    </View>
    
  );
}


export default QRComponent;