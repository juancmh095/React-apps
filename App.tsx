/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import {Alert, View, StyleSheet, Modal, ToastAndroid,} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import { Card, Input } from 'react-native-elements';
import axios from 'axios';
import RNFS from 'react-native-fs';
import Geolocation from '@react-native-community/geolocation';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick, types } from 'react-native-document-picker'
import { Camera } from 'react-native-vision-camera';

import  DigitalSignature from './components/DigitalSignature';
import  QRComponent from './components/QR';
import  QuillComponent from './components/Quill.jsx';
import  ContactsComponent from './components/Contacts.jsx';
import  FilesComponent from './components/Files.jsx';


function App() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);
  const [typeModal, setTypeModal] = React.useState('qr');

  const ref = useRef();
  const _api = 'http://20.64.97.37/api/products';
  const urlFunction = async (text) => {
    console.log(text);
    var reponse = await axios.post(`${_api}`,{
      Id:1,
      json:'"{\"Function\":\"WriteAtach\",\"Base64\":\"\", \"Parameter\":\"0|FUDC|55PL001|'+text+'|URL|RROJAS|20240401|122300|DISPOSITIVO1|\"}"',
      Category:"Utilerias"
    });
    console.log(reponse.data)
    if(reponse.data.Json == 'OK'){
      showToast('Exito al guardar')
      setModalVisible(false);
    } else {
      showToast('Error al guardar')
    }

  }

  useEffect(() => {
    checkPermission();
  });


  const checkPermission = async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      const newMicrophonePermission = await Camera.requestMicrophonePermission();
      console.log(newCameraPermission,'permiso');
  }
  
  

  const getGeo = async () => {
    await Geolocation.getCurrentPosition(async(info) => {
      console.log(info);
      var geo = info.coords.latitude + ',' + info.coords.longitude;
      var reponse = await axios.post(`${_api}`,{
        Id:1,
        json:'"{\"Function\":\"WriteAtach\",\"Base64\":\"\", \"Parameter\":\"0|FUDC|55PL001|'+geo+'|GEO|RROJAS|20240401|122300|DISPOSITIVO1|\"}"',
        Category:"Utilerias"
      });
      console.log(reponse.data);
      if(reponse.data.Json == 'OK'){
        showToast('Exito al guardar')
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
    
    await constHttpPost(result.assets[0].base64, result.assets[0].fileName, name[1]); q
  }

  const GetCamera = async () => {
    
    let options = {
      mediaType:'mixed',
      cameraType:'back',
      includeBase64:true,
      includeExtra: true
    };
    console.log(options);

    const result = await launchCamera(options);
    await constHttpPost(result.assets[0].base64, result.assets[0].fileName, 'JPG');
    
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
      var ext = result.type;
      ext = ext.split('/');

      await constHttpPost(file, result.name, ext[0]);
      
    } catch (err) {
      // see error handling
    }
  }

   const constHttpPost = async (file,name,ext) => {
    var reponse = await axios.post(`${_api}`,{
      Id:1,
      json: JSON.stringify({
        Function:"WriteAtach",
        Base64:file,
        Parameter:"0|FUDC|55PL001|"+name+"|"+ext+"|RROJAS|20240401|122300|DISPOSITIVO1|"
      }),
      Category:"Utilerias"
    });
    console.log(reponse.data);
    if(reponse.data.Json == 'OK'){
      showToast('Exito al guardar')
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
          <Button
          buttonStyle={styles.button}
          title="Lista de Archivos"
          icon={{name:'documents-outline', type:'ionicon', color:'white'}}
          onPress={() => {
            setTypeModal('lista');
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
            <View style={styles.modalView}>
              {typeModal == 'qr'?  <QRComponent /> : ''}
              {typeModal == 'signature'? <DigitalSignature /> : ''}
              {typeModal == 'contacts'? <ContactsComponent /> : ''}
              {typeModal == 'text'? <QuillComponent  /> : ''}
              {typeModal == 'lista'? <FilesComponent  /> : ''}
              {typeModal == 'url'? <Input
                      label='Enter URL'
                      leftIcon={{ type: 'font-awesome', name: 'link' }}
                      onEndEditing={value => urlFunction(value.nativeEvent.text)}
                    /> : ''}
              


              <Button
              title={'Cerrar'}
                  buttonStyle={{
                    borderColor: 'rgba(78, 116, 289, 1)',
                  }}
                  type='clear'
                  containerStyle={{
                    width: 450,
                    marginEnd:'auto',
                    marginStart:'auto',
                    marginTop:20
                  }}
                onPress={() => setModalVisible(!modalVisible)}
              ></Button>
              </View>
            </View>
          </Modal>
        {/* modal Final de button URL */}
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

export default App;
