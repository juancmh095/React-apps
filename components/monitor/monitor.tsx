import React, { useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView, View } from "react-native";
import { ButtonGroup, ListItem, Text } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "../../Storage";

import * as rqdata from '../params_request';
import axios from "axios";
import Tts from "react-native-tts";

const MonitorComponent =  ({ navigation }) => {


    const [usuario, setUsuario] = React.useState(null);
    const [dataInfo, setDataInfo] = React.useState([]);

    var url_api="";

    const speak = (txt) => { 
        console.log(txt);
        Tts.setDucking(true);
        Tts.stop();
        Tts.setIgnoreSilentSwitch("ignore");
        Tts.speak(txt);
    };

    const getDataInfo = async (user)=>{
        console.log('entra a buscar info',user)
        let data = user['usukides'] + '|' + user['usukiduser'] + '|';
        let body = rqdata.getCarga('SALIDAINQPANT','I',data);
        let response = await axios.post(`${url_api}`,body);
        console.log(response.data,body);
        if(response.data.Json != ''){
            let d = JSON.parse(response.data.Json);
            console.log(d['FSALIDAINQPANT']);
            setDataInfo(d['FSALIDAINQPANT']);
            let arrTxt = d['FSALIDAINQPANT'];
            var textVoice = ""
            for (let i = 0; i < arrTxt.length; i++) {
                const element = arrTxt[i];
                console.log('---->',element)                
                textVoice += element['Alumno'] + ' ';
            }

            speak(textVoice);
        }
    }

    const validateUser = async () => {
        let url = await AsyncStorage.getItem('api');
        url_api = url;

        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            setUsuario(...res[0]);
            getDataInfo(res[0]);
            
        });
    }

    const backAction = () => {
        Tts.stop();
    }

    useEffect(() => {
        
        
        validateUser();

        Tts.voices().then(voices => {
            Tts.setDefaultVoice(voices[0].id)
            Tts.setDefaultLanguage(voices[0].language);
        });
        Tts.addEventListener('tts-finish', (event) => {

            console.log('event',event);
            getDataInfo(usuario);
        });

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
          );

        return () => {
            backHandler.remove();
            Tts?.removeEventListener('tts-finish');
            return;
        }
    }, []);

    return (
        <View>
            <ButtonGroup
            buttons={['Selec','Buscar','Agregar','Salir','Anexos']}
            selectedIndex={null}
            buttonStyle={{backgroundColor:'#E1E1E1'}}
            buttonContainerStyle={{borderColor:'gray'}}
            onPress={(value) => {
              console.log(value);
                if(value == 3){
                    Tts.stop();
                    navigation.navigate('Login');
                }
            

            }}
            containerStyle={{ marginBottom: 20 }}
          />
          
            <ScrollView>
          {dataInfo.map((item,i) => {
            return(
                <ListItem style={{margin:10}}>
                    <ListItem.Content>
                        <ListItem.Title onPress={()=> console.log('item')}>
                            <Text style={{fontWeight:900}}>Alumno: </Text> {item['Alumno']} 
                        </ListItem.Title>
                        <ListItem.Title onPress={()=> console.log('item')}>
                            <Text style={{fontWeight:900}}>Tutor: </Text> {item['Tutor1']} 
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>

            )
          })}

        </ScrollView>
        </View>
    )
}


export default MonitorComponent;