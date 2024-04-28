/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {Alert, View, StyleSheet, Modal, Pressable, TextInput, PermissionsAndroid } from 'react-native';
import { Button, Icon,Text } from '@rneui/themed';
import  DigitalSignature from './components/DigitalSignature';
import  QRComponent from './components/QR';
import { Card, Input } from 'react-native-elements';
import axios from 'axios';
import Contacts from 'react-native-contacts';
import Geolocation from '@react-native-community/geolocation';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick } from 'react-native-document-picker'


function App() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [modalVisible3, setModalVisible3] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);
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

  
  return (
    <>
      <View style={styles.container}>
        <Button 
          buttonStyle={styles.button}
          title="Archivos"
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
          onPress={() => setModalVisible(true)}
          />
          {/* modal inicio de button texto */}
          <Modal
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TextInput 
              multiline={true} 
              style={styles.textarea} 
              numberOfLines={8}
              placeholder='Escribe tu texto...'
            />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
              </View>
            </View>
          </Modal>
          {/* modal Final de button texto */}
        <Button
          buttonStyle={styles.button}
          title="Firma"
          onPress={() => setModalVisible2(true)}
          />
          {/* modal inicio de button texto */}
          <Modal
            animationType="slide"
            visible={modalVisible2}
            onRequestClose={() => {
            setModalVisible(!modalVisible2);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <DigitalSignature />
              {/* <QRComponent /> */}
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible2(!modalVisible2)}>
                <Text style={styles.textStyle}>Hide Modal2</Text>
              </Pressable>
              </View>
            </View>
          </Modal>
          {/* modal Final de button texto */}
        <Button
          buttonStyle={styles.button}
          title="Url"
          onPress={() => setModalVisible3(!modalVisible2)}
          />
          {/* modal inicio de button URL */}
          <Modal
            animationType="slide"
            visible={modalVisible3}
            onRequestClose={() => {
            setModalVisible(!modalVisible3);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Input
                label='Enter URL'
                leftIcon={{ type: 'font-awesome', name: 'comment' }}
                onEndEditing={value => urlFunction(value.nativeEvent.text)}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible3(!modalVisible3)}>
                <Text style={styles.textStyle}>Hide Modal3</Text>
              </Pressable>
              </View>
            </View>
          </Modal>
          {/* modal Final de button URL */}
        <Button
          buttonStyle={styles.button}
          title="QR"
          onPress={() => setModalVisible2(true)}
        />
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
    margin:'auto',
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
  iconsActions:{
    
  }
});

export default App;
