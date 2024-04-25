
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import  SignatureScreen from 'react-native-signature-canvas';


const DigitalSignature = () => {
    
    const ref = useRef();

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
    onOK(signature); // Callback from Component props
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
  };

  const imgWidth = 300;
const imgHeight = 200;
const style = `.m-signature-pad {box-shadow: none; border: none; }
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;
  return (
    <View style={styles.signature}>
        <View style={{ width: imgWidth, height: imgHeight }}>
  <SignatureScreen
    ref={ref}
    bgSrc="https://via.placeholder.com/300x200/ff726b"
    bgWidth={imgWidth}
    bgHeight={imgHeight}
    webStyle={style}
    onOK={handleOK}
  />
</View>
    </View>
  );
}

const styles = StyleSheet.create({
    
    signature:{
      height:'300px',
      width:'100%',
      backgroundColor:'red'
    }
  });

export default DigitalSignature;