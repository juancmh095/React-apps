
import React, { useRef } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import  SignatureScreen from 'react-native-signature-canvas';
import axios from 'axios';
import { Button } from "react-native-elements";
const _api = 'http://20.64.97.37/api/products';

import  {default as _apiServices} from '../../tools/api';
import AsyncStorage from "@react-native-async-storage/async-storage";


const DigitalSignature = ({setModalVisible,req}) => {
    
  const ref = useRef();
  const [s, setS] = React.useState('qr');
  const handleOK = (signature) => {
    setS(signature);
  };
  const handleEnd = () => {
    ref.current.readSignature();
  };

  const firmaFunction = async () => {
    console.log(s);
    var b64 = s.replace('data:image/png;base64,','');

    var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
    usuario = JSON.parse(usuario);

    var dataRoute = req['params'];
    var params = usuario['usukides']+'|'+dataRoute['Programa']+'|'+dataRoute['params']+'|'+'Text1|PNG|';
    var reponse = await await _apiServices('FANEXO','Mi Appescolar','WriteAtach',params,b64,'Utilerias','0');
    console.log(reponse);
    if(reponse[0] == 'OK'){
      showToast('Firma guardada satisfactoriamente');
      ref.current.clearSignature();
      setModalVisible(false);
    } else {
      showToast('Error al guardar')
    }

  }
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };


  const imgWidth = '100%';
  const imgHeight = 400;
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
    height:450,
    width:'98%',
    borderWidth:1,
    marginStart:'auto',
    marginEnd:'auto',
    marginBottom:10,
    marginTop:10
  }
});

export default DigitalSignature;