
import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera, getCameraDevice, CodeScanner } from "react-native-vision-camera";
import { Button, Text } from "react-native-elements";


const QRComponent = () => {
    const devices = Camera.getAvailableCameraDevices()
    const device = getCameraDevice(devices, 'back')    
    const [restult, setResult] = React.useState('')
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
            
            <Button title='Enviar'></Button>
    </View>
    
  );
}


export default QRComponent;