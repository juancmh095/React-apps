import React, { useEffect, useRef, useState } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { ButtonGroup, ListItem, Text } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "../../src/services/Storage";

import * as rqdata from '../params_request';
import axios from "axios";
import Tts from "react-native-tts";

const MonitorComponent =  ({ navigation }) => {


    const [usuario, setUsuario] = React.useState(null);
    const [dataInfo, setDataInfo] = React.useState([]);
    const [BtnArry, setBtnArry] = React.useState([]);
    const [titulo, setTitulo] = React.useState([]);

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
            getButtons(res[0]);
        });
    }

    const getButtons= async (usuario)=>{
        let data = '0|1|';
        var body = rqdata.getCarga('INQBARRA','I',data);
        var response = await axios.post(`${url_api}`,body);
        if(response.data.Json != ""){
            let d = JSON.parse(response.data.Json);
            var btns = [];
            for (let i = 0; i < d['FINQBARRA'].length; i++) {
              const element = d['FINQBARRA'][i];
              btns.push(element.Titulo)
            }
            console.log(d);
            setBtnArry(btns);
          }

          var idIdioma = await AsyncStorage.getItem('idioma');

          var respTitulo = await axios.post(`${url_api}`, rqdata.getTitulo('PMONITOR','B',idIdioma));

            var ttl = respTitulo.data;
            if(ttl.Json != ''){
                var pNameJson = JSON.parse(ttl.Json);
                let pName = pNameJson['FFormName'][0];
                setTitulo(pName['FNNAME']);
            }
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
            buttons={BtnArry}
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
          
          <View style={styles.headerTitulo}>
            <Text style={{textAlign:'center', fontSize:20}}>{titulo}</Text>
        </View>

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

const styles = StyleSheet.create({
    headerTitulo:{
        textAlign: 'center',
        padding: 10,
        width:'100%',
      }
})


export default MonitorComponent;