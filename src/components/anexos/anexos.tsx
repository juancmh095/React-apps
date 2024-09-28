import React, { useEffect, useRef } from 'react';
import {Alert, View, StyleSheet, Modal, ToastAndroid,} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { Card, Input, Text } from 'react-native-elements';
import axios from 'axios';
import RNFS from 'react-native-fs';
import Geolocation from '@react-native-community/geolocation';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick, types } from 'react-native-document-picker';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import type {
  ResizeMode,
  Response,
} from '@bam.tech/react-native-image-resizer';
import { Camera } from 'react-native-vision-camera';

import  DigitalSignature from './plugins/DigitalSignature.jsx';
import  QRComponent from './plugins/QR.jsx';
import  QuillComponent from './plugins/Quill.jsx';
import  ContactsComponent from './plugins/Contacts.jsx';

import  {default as _apiServices} from '../tools/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


function Anexos(props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);
  const [typeModal, setTypeModal] = React.useState('qr');

  const ref = useRef();
  const _api = 'http://20.64.97.37/api/products';

  const closeModal = ()=>{
    setModalVisible(false);
  }

  const urlFunction = async (text) => {
    var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
    usuario = JSON.parse(usuario);

    var dataRoute = props['route']['params'];
    var params = usuario['usukides']+'|'+dataRoute['Programa']+'|'+dataRoute['params']+'|'+text+'|URL|';
    var response = await await _apiServices('FANEXO','Mi Appescolar','WriteAtach',params,'','Utilerias','0');
    console.log(response);
    if(response[0] == 'OK'){
      showToast('Exito al guardar')
      setModalVisible(false);
    } else {
      showToast('Error al guardar')
    }

  }

  const sendUrl = async ()=>{
    ref.current.blur();
  }

  useEffect(() => {
    checkPermission();
  },[]);


  const checkPermission = async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      const newMicrophonePermission = await Camera.requestMicrophonePermission();
      console.log(newCameraPermission,'permiso');
  }
  
  

  const getGeo = async () => {
    Geolocation.getCurrentPosition(async(info) => {
      console.log(info);
      var geo = info.coords.latitude + ',' + info.coords.longitude;

      var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
      usuario = JSON.parse(usuario);

      var dataRoute = props['route']['params'];
      var params = usuario['usukides']+'|'+dataRoute['Programa']+'|'+dataRoute['params']+'|'+geo+'|GEO|';
      var reponse = await await _apiServices('FANEXO','Mi Appescolar','WriteAtach',params,'','Utilerias','0');
      console.log(reponse);

      if(reponse[0] == 'OK'){
        showToast('Geoposición guardada satisfactoriamente')
      } else {
        showToast('Error al guardar')
      }
    });
    
  }

  const GetPicker = async () => {
    
    let options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64:true,
      selectionLimit:1
    };
    console.log(options);

    const result = await launchImageLibrary(options);
    var name = result.assets[0].fileName;
    name = name.split('.')

    let resize = await ImageResizer.createResizedImage(
      result.assets[0].uri,
      1000,
      1000,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {
        mode: 'contain',
        onlyScaleDown: false,
      }
    );
    var file = await RNFS.readFile(resize.uri, 'base64');
    
    await constHttpPost(file, result.assets[0].fileName, 'JPEG','Imagen guardada satisfactoriamente');
  }

  const GetCamera = async () => {
    
    let options = {
      mediaType:'photo',
      cameraType:'back',
      quality:1,
      includeBase64:true,
      includeExtra: true
    };

    const result = await launchCamera(options);
    console.log(result.assets[0].fileSize);
    let resize = await ImageResizer.createResizedImage(
      result.assets[0].uri,
      1000,
      1000,
      'JPEG',
      100,
      0,
      undefined,
      false,
      {
        mode: 'contain',
        onlyScaleDown: false,
      }
    );
    var file = await RNFS.readFile(resize.uri, 'base64');
    console.log(file);
    await constHttpPost(file, result.assets[0].fileName, 'JPG','Foto guardada satisfactoriamente');
    
  }

  const getDocuments = async ()=>{
    try {
      const [result] = await pick({
        mode: 'open',
        allowMultiSelection: false,
        type: [types.pdf, types.docx, types.pptx, types.xlsx, types.plainText, types.csv, types.zip],
      })
      console.log(result)
      var file = await RNFS.readFile(result.uri, 'base64');
      var ext = result.name;
      ext = ext.split('.');
      var sizeExt = ext.length;
      console.log(ext[sizeExt-1])
      await constHttpPost(file, result.name, ext[sizeExt-1],'Documento guardado satisfactoriamente');
      
    } catch (err) {
      // see error handling
    }
  }

   const constHttpPost = async (file,name,ext, msg) => {

    var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
    usuario = JSON.parse(usuario);

    var dataRoute = props['route']['params'];
    var params = usuario['usukides']+'|'+dataRoute['Programa']+'|'+dataRoute['params']+'|'+name+'|'+ext+'|';
    var reponse = await await _apiServices('FANEXO','Mi Appescolar','WriteAtach',params,file,'Utilerias','0');
    console.log(reponse);

    if(reponse[0] == 'OK'){
      showToast(msg)
    } else {
      showToast('Error al guardar')
    }
  }

    const showToast = (text) => {
      ToastAndroid.show(text, ToastAndroid.SHORT);
    };

 

  
  return (
    <>
      <View style={styles.container}>
        <Button 
          buttonStyle={styles.button}
          title="Archivos"
          icon={{name:'document-outline', type:'ionicon', color:'white'}}
          onPress={() => setShowActions(!showActions)}
          />
          {(showActions && (

            <Card>
              <Card.Title>Acciones</Card.Title>
              <Card.Divider />
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
              <Icon
                reverse
                name='file-document-outline'
                type='material-community'
                color='#7552E5'
                onPress={ () => getDocuments()}
              />
              <Icon
                reverse
                name='camera'
                type='material-community'
                color='#D8126A'
                onPress={() => GetCamera()}
              />
              <Icon
                reverse
                name='image-multiple'
                type='material-community'
                color='#C04BF5'
                onPress={() => GetPicker()}
              />
              <Icon
                reverse
                name='map-marker'
                type='material-community'
                color='#2AAA52'
                onPress={() => getGeo()}
              />
              </View>
              <View>
                <Icon
                  reverse
                  name='person'
                  type='ionicons'
                  color='#0F9ACD'
                  onPress={() => {
                    setTypeModal('contacts');
                    setModalVisible(true);
                  }}
                />
              </View>
            </Card>
          ))}
        <Button
          buttonStyle={styles.button}
          title="Texto"
          icon={{name:'document-text-outline', type:'ionicon', color:'white'}}
          onPress={() => {
            setTypeModal('text');
            setModalVisible(true);
          }}
          />
        
        <Button
          buttonStyle={styles.button}
          title="Url"
          icon={{name:'link-outline', type:'ionicon', color:'white'}}
          onPress={() => {
            setTypeModal('url');
            setModalVisible(true);
          }}
          />
        <Button
            buttonStyle={styles.button}
            title="Firma"
            icon={{name:'pencil-outline', type:'ionicon', color:'white'}}
            onPress={() => {
              setTypeModal('signature');
              setModalVisible(true);
            }}
          />
            
          <Button
            buttonStyle={styles.button}
            title="QR"
            icon={{name:'qr-code-outline', type:'ionicon', color:'white'}}
            onPress={async () => {
              setTypeModal('qr');
              setModalVisible(true);
            }}
          />
  
        {/* modal inicio de button URL */}
          <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
          <Button
              title={'Cancelar'}
                  buttonStyle={{
                    borderColor: 'rgba(78, 116, 289, 1)',
                  }}
                  type='solid'
                  containerStyle={{
                    marginEnd:'auto',
                    marginStart:10,
                    width:150,
                    marginTop:20,
                    marginBottom:10
                  }}
                onPress={() => setModalVisible(!modalVisible)}
              ></Button>
              <Card.Divider />
            <View style={styles.modalView}>
              {typeModal == 'qr'?  <QRComponent setModalVisible={setModalVisible} req={props['route']['params']} /> : ''}
              {typeModal == 'signature'? <DigitalSignature setModalVisible={setModalVisible} req={props['route']['params']} /> : ''}
              {typeModal == 'contacts'? <ContactsComponent setModalVisible={setModalVisible} req={props['route']['params']} /> : ''}
              {typeModal == 'text'? <QuillComponent   setModalVisible={setModalVisible} req={props['route']['params']} /> : ''}
              {typeModal == 'url'? <Input
                      label='Enter URL'
                      leftIcon={{ type: 'font-awesome', name: 'link' }}
                      ref={ref}
                      onEndEditing={value => urlFunction(value.nativeEvent.text)}
                    />  : ''}
              {typeModal == 'url'? <Button title={'Enviar'} onPress={()=> sendUrl()}></Button>  : ''}
              


              
              </View>
            </View>
          </Modal>
        {/* modal Final de button URL */}
        <Text h5 style={{color: 'black'}}>V1.0.1</Text>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  button: {
    margin: 10,
    borderRadius:10
  },
  container:{
    marginTop:'auto',
    marginEnd:'auto',
    marginStart:'auto',
    marginBottom:'auto',
    width: '80%',
  },
  textarea:{
    height: '50px',
    width:'80%',
    borderWidth:1,
    margin:'auto',
    borderRadius:5,
    borderColor:'gray'
  },
  buttonCLose:{
    width:'45%',
    margin:10

  },
  iconsActions:{
    
  }
});

export default Anexos;