
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import  SignatureScreen from 'react-native-signature-canvas';
import axios from 'axios';
import { Button } from "react-native-elements";
const _api = 'http://20.64.97.37/api/products';


const DigitalSignature = () => {
    
  const ref = useRef();
  var s = "";
  const handleOK = (signature) => {
    s = signature;
  };
  const handleEnd = () => {
    ref.current.readSignature();
  };

  const firmaFunction = async () => {
    console.log(s);
    
    var reponse = await axios.get(`${_api}`,{
      Id:1,
      json:'{Function:"WriteAtach",Base64:"'+s+'",Parameter:"FUDC|55PL001|Text1|png|RROJAS|20240401|122300|DISPOSITIVO1"}',
      Category:"Utilerias"
    });
    console.log(reponse.data)

  }


  const imgWidth = '98%';
  const imgHeight = 300;
  const style = `.m-signature-pad {box-shadow: none; border: none; }
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}; height: ${imgHeight}px;}`;
  return (
    <View style={styles.signature}>
      <SignatureScreen
        ref={ref}
        descriptionText="Firma"
        bgWidth={imgWidth}
        bgHeight={imgHeight}
        ref={ref}
        onDraw={handleOK}
        onOK={handleOK}
        onEnd={handleEnd}
        webStyle={style}
      />

      <Button
          title="Firmar"
          onPress={() => firmaFunction()}
          />
    </View>
    
  );
}

const styles = StyleSheet.create({    
  signature:{
    height:300,
    width:'98%',
    borderWidth:1,
    margin:'auto',
    marginTop:10
  }
});

export default DigitalSignature;