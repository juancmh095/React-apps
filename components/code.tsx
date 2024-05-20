import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, getCameraDevice, CodeScanner } from "react-native-vision-camera";
import { Button, Text } from "react-native-elements";
import axios from "axios";


const QRComponent = ({setModalVisible,lote,setLote, form}) => {
    const devices = Camera.getAvailableCameraDevices()
    const device = getCameraDevice(devices, 'back')    
    const [restult, setResult] = React.useState('')
    useEffect(() => {
        checkPermission();
    });
    

    const checkPermission = async () => {
        const newCameraPermission = await Camera.requestCameraPermission();
        const newMicrophonePermission = await Camera.requestMicrophonePermission();
    }
    if(device == null) return <ActivityIndicator />
    
    const codeScanner: CodeScanner = {
        codeTypes: ['qr', 'ean-13','upc-a','code-128'],
        onCodeScanned: (codes) => {
            setResult(codes[0].value);
        }
      }

    const SendQR = async()=>{
        setModalVisible(false);
        console.log(lote);
        lote['LOBARCODE'] = restult;
        setLote(lote);
        form.current.setFieldValue('LOBARCODE',restult);
    }

 
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
            
            <Button title='Enviar' disabled={restult != ''?false:true} onPress={()=> SendQR()}></Button>
            <Button title='Cancelar' type="clear" onPress={()=> setModalVisible(false)}></Button>
    </View>
    
  );
}


export default QRComponent;