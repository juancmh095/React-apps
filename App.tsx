/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import {Alert, View, StyleSheet, Modal, Pressable, TextInput, PermissionsAndroid } from 'react-native';
import { Button, Icon,Text } from '@rneui/themed';
import { Card, Input } from 'react-native-elements';
import axios from 'axios';
import Contacts from 'react-native-contacts';
import Geolocation from '@react-native-community/geolocation';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { pick } from 'react-native-document-picker'
import { Camera, CodeScanner, getCameraDevice } from 'react-native-vision-camera';

import  DigitalSignature from './components/DigitalSignature';
import  QRComponent from './components/QR';
import  QuillComponent from './components/Quill.jsx';


function App() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);
  const [typeModal, setTypeModal] = React.useState('qr');

  const ref = useRef();
  const _api = 'http://20.64.97.37/api/products';
  const urlFunction = async (text) => {
    console.log(text);
    var reponse = await axios.get(`${_api}`,{
      Id:1,
      json:'{Function:"ReadAtach",Base64:"",Parameter:"FUDC|55PL001|https://20.64.97.37/2/2.jpg|'+text+'|RROJAS|20240401|122300|DISPOSITIVO1"}',
      Category:"Utilerias"
    });
    console.log(reponse.data)

  }

  useEffect(() => {
    checkPermission();
  });


  const checkPermission = async () => {
      const newCameraPermission = await Camera.requestCameraPermission();
      const newMicrophonePermission = await Camera.requestMicrophonePermission();
      console.log(newCameraPermission,'permiso');
  }
  
  const GetContacts = async () =>{
    try {
      const andoidContactPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      console.log(andoidContactPermission)
      if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Contacts Permission granted");
        Contacts.getAll()
        .then((contacts) => {
            // work with contacts
            console.log(contacts);
        })
        .catch((e) => {
            console.log(e);
        })
      } else {
        console.log("Contacts permission denied");
      }
    } catch (err) {
      console.log('error',err);
    }
  
  }

  const getGeo = async () => {
    await Geolocation.getCurrentPosition(info => console.log(info));
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
    };
    console.log(options);

    const result = await launchImageLibrary(options);
    console.log(result)
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
    console.log(result)
  }

  const codeScanner: CodeScanner = {
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`)
    }
  }

  const devices = Camera.getAvailableCameraDevices()
  
  const device = getCameraDevice(devices, 'back')


  
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
                onPress={async () => {
                  try {
                    const [result] = await pick({
                      mode: 'open',
                    })
                    console.log(result)
                  } catch (err) {
                    // see error handling
                  }
                }}
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
                  onPress={() => GetContacts()}
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
            <View style={styles.modalView}>
              {typeModal == 'qr'?  <QRComponent /> : ''}
              {typeModal == 'signature'? <DigitalSignature /> : ''}
              {typeModal == 'text'? <QuillComponent  /> : ''}
              {typeModal == 'url'? <Input
                      label='Enter URL'
                      leftIcon={{ type: 'font-awesome', name: 'comment' }}
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
