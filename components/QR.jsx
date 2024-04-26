
import {  View } from "react-native";
import React from "react";
import { Camera, useCameraDevice } from "react-native-vision-camera";



const QRComponent = () => { ;
    
    const device = useCameraDevice('back')
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
    
      
}


export default QRComponent;