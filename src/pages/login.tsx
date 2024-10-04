import { ActivityIndicator, Modal, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";

import * as rqdata from '../components/tools/params_request';
import storage from "../services/Storage";
import {default as _apiServices} from "../components/tools/api";
import DeviceInfo from "react-native-device-info";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginComponent = ({navigation}) => {
    const formikRef = useRef();
    const [textinit, setExtInit] = React.useState('Bienvenido');
    const [passView, setPasswordView] = React.useState(true);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [newApi, setNewApi] = React.useState('');
    const [lablesURL, setLabelsURL] = React.useState({METITLE:'',MEOK:'',MEMESSAGE:'',MECANCEL:''});
    const url_api = "http://20.64.97.37/api/products";
   
    useEffect(() => {
        validateUser();
    },[])

    const validateUser = async () => {
        var id = await AsyncStorage.getItem('usukiduser');
        formikRef.current?.setFieldValue('user',id);
        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            console.log('aqui el usuario',res);
            
            if(res.length > 0){
                navigation.navigate('Init')
            }

        });
    }

    const getLabelsUrl = async () => {
        try {
            setModalVisible(true);
            const response = await _apiServices('program','','LABELS',[{action:"I",Data:"URL|1|"}],{},'Mi App','0');
            console.log(response);
            setLabelsURL({...response[0]})
            var apix = await AsyncStorage.getItem('api');
            setNewApi(apix);
        } catch (error) {
            console.log(error);
        }
    }
    
    
    const loginFunc = async () => {
        var forms = formikRef.current.values;
        let dispositivo = DeviceInfo.getDeviceNameSync();
        
        let body = rqdata.encrypPass;
        let json = JSON.parse(body.json);
        json.Data = forms['password'];
        body.json = JSON.stringify(json);
        console.log(body);
        var reponse = await axios.post(`${url_api}`,body);
        if(reponse.data.Json){
            let pass = reponse.data.Json;
            console.log(reponse.data);
            //let pass = "JrVZl/C6Gr/dLBQMKJXJVA==";
            let body = rqdata.login;
            let json = JSON.parse(body.json);
            let row = json.Rows;
            const fcmToken = await messaging().getToken();
            let r = forms['user'] + "|"+pass+"|"+dispositivo+'|'+fcmToken+'|';
            row[0]['Data'] = r;
            json.Rows = row;
            body.json = JSON.stringify(json);
            console.log(body);
            var reponseLogin = await axios.post(`${url_api}`,body);
            console.log(reponseLogin.data);
            if(reponseLogin.data.Json != ''){
                let data = JSON.parse(reponseLogin.data.Json);
                storage.save({
                    key:'FUSERSLOGIN',
                    id:'1',
                    data: data['FUSERSLOGIN'][0]
                });
                var userx = data['FUSERSLOGIN'][0];
                await AsyncStorage.setItem('api', userx['ESPATHAPI']);
                await AsyncStorage.setItem('usukiduser', userx['usukiduser']);
                await AsyncStorage.setItem('idioma', userx['usidioma']);
                await AsyncStorage.setItem('psw', pass);
                var userx2 = JSON.stringify(userx);
                await AsyncStorage.setItem('FUSERSLOGIN', userx2);
                console.log('rol',userx['usrol'],userx['ESPATHAPI']);
                //navigation.navigate('Program')
                if(userx['usrol'] == '1'){
                    navigation.navigate('Maestro/Inicio')
                    //navigation.navigate('Compra')
                }else{
                    if(userx['usrol'] == '2'){
                        navigation.navigate('Tutor/Inicio')
                    }else{
                        if(userx['usrol'] == '4'){
                            navigation.navigate('Monitor')
                        }else{
                            navigation.navigate('Banners')
                        }
                    }
                }
            }else{
                ToastAndroid.show('Usuario o contraseña invalido', ToastAndroid.LONG);

            }
        }
    }


  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
        <View>
            <Formik
                initialValues={{user:'', password:''}}
                innerRef={formikRef}
                onSubmit={values => console.log(values)}
            >
                {({ handleChange, setFieldValue, handleSubmit, values }) => (
                    <View style={styles.inputs}>
                        <Text h4 style={{textAlign:'center'}}>{textinit}</Text>
                        <Input 
                            placeholder='Usuario'
                            leftIcon={
                                <Icon
                                    name='person'
                                    color='black'
                                    />
                            }
                            value={values.user}
                            onChangeText={handleChange('user')}
                            />
                        <Input 
                            placeholder='Password'
                            secureTextEntry={passView}
                            leftIcon={
                                <Icon
                                name='https'
                                color='black'
                                />
                            }
                            rightIcon={
                                <Icon
                                    name='remove-red-eye'
                                    color='black'
                                    onPress={()=> setPasswordView(!passView)}
                                    />
                            }
                            value={values.password}
                            onChangeText={handleChange('password')}

                            />
                        <Button title={'Enviar'} onPress={() => loginFunc()}></Button>

                    </View>

                )}
            </Formik>

            <Button title={'URL'} type="clear" onPress={()=> getLabelsUrl()} />
        </View>

        <Modal
            style={{width:'50%',height:'50%'}}
            animationType="fade"
            presentationStyle={'overFullScreen'}
            transparent={true}
            visible={modalVisible}
            >
            <View>
                
              <View style={{
                width:'80%',
                marginStart:'auto',
                marginEnd:'auto',
                marginTop:100,
                marginBottom:'auto',
                backgroundColor:'white',
                padding:10,
                shadowColor: '#000',
                shadowOffset: {
                width: 0,
                height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              }}>
                
                <Text style={{textAlign:'center', fontSize:20, fontWeight:'900'}}>{lablesURL['METITLE']}</Text>
                <Text style={{fontSize:15, fontWeight:'800'}}>{lablesURL['MEMESSAGE']}</Text>
                <Input style={styles.inputs} value={newApi} onChangeText={(text)=> setNewApi(text)} />
                <View style={styles.btnr}>
                    <Button title={lablesURL['MEOK']} onPress={async ()=>{
                        await AsyncStorage.setItem('api', newApi);
                        setModalVisible(false)
                    }}
                    ></Button>               
                </View>
                <View style={styles.btnl}>             
                    <Button title={lablesURL['MECANCEL']} onPress={async ()=> {
                        
                        await AsyncStorage.setItem('api', url_api);
                        setModalVisible(false)
                    }}></Button>               
                </View>
              </View>
            </View>
          </Modal>
    </View>
    
  );
}

const styles = StyleSheet.create({
    inputs:{
        width:'80%',
        height:'60%',
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:'auto'
    },
    btnr:{
        marginEnd:0,
        width:'40%',
        marginStart:0
    },
    btnl:{
        width:'40%',
        marginStart:'auto',
        marginTop:-40
    }
})


export default LoginComponent;