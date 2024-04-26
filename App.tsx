/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {Alert, View, StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import { Button, Icon,Text } from '@rneui/themed';
import  DigitalSignature from './components/DigitalSignature';
import  QRComponent from './components/QR';
import { Input } from 'react-native-elements';
import axios from 'axios';



function App() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [modalVisible3, setModalVisible3] = React.useState(false);
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
  

  
  return (
    <>
      <View style={styles.container}>
        <Button 
          buttonStyle={styles.button}
          title="Archivos"
          onPress={() => Alert.alert('Simple Button pressed')}
          />
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
  }
});

export default App;
