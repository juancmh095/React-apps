import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import * as rqdata from './params_request';
import Tts from 'react-native-tts';
import { ButtonGroup, Icon } from 'react-native-elements';

const TextToSpeech = (props) => {
  const [text, setText] = useState('');
  const [userVocie, setUserVoice] = useState('');
  const [iVoice, setiVoice] = useState([]);

  const url_api = "http://20.64.97.37/api/products";


  const get_data = async() => {
    var login = await axios.post(url_api,rqdata.loginVoice);
    if(login.data.Json != ''){
        loginres = JSON.parse(login.data.Json);
        var user = loginres['FUSERSLOGIN'][0];
        setUserVoice(user);
        var textVoices = await axios.post(url_api,rqdata.textVoice);

        if(textVoices.data.Json != ''){
            var txtVoices = JSON.parse(textVoices.data.Json);
            var arrTxt = txtVoices['FHABLARBOCINQ'];
            var idi = setInterval(async() => {
                for (let y = 0; y < arrTxt.length; y++) {
                    const element = arrTxt[y];
                    setTimeout(() => {
                        setText(element['HAPATHPLAY'])
                        speak(element['HAPATHPLAY']);
                    }, 1000);
                    
                }
            }, Number(user['Tiempo'])*1000);
            iVoice.push(idi);
            setiVoice([...iVoice]);
        }
    }

        
  }

  useEffect(()=>{
        get_data();
      Tts.voices().then(voices => {
        Tts.setDefaultVoice(voices[0].id)
        console.log(voices);
        Tts.setDefaultLanguage(voices[0].language);
    });

      return () => {
        return false;
      };
  },[])

  const speak = (txt) => { 
    console.log(txt);
    Tts.setDucking(true);
    Tts.stop();
    Tts.setIgnoreSilentSwitch("ignore");
    Tts.speak(txt);
  };

  return (
    <View style={styles.container}>

        <View style={styles.headerTitulo}>
            <Text style={{textAlign:'center', fontSize:20, color:'black'}}>{'Voice'}</Text>
        </View>

        <ButtonGroup
        buttons={[
            <View style={styles.navBarLeftButton}><Icon name='close' color={'red'} /><Text style={styles.buttonText}>Salir</Text></View>
        ]}
        selectedIndex={null}
        buttonStyle={{backgroundColor:'#E1E1E1'}}
        buttonContainerStyle={{borderColor:'gray'}}
        onPress={(value) => {
            console.log(value,props);
            for (let id of iVoice) {
                clearInterval(id);
                console.log(id);
            };

            props.setModalVisible(false)

        }}
        containerStyle={{ marginBottom: 20 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter text to speak"
        onChangeText={setText}
        value={text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:500,
    alignItems: 'center',
    color:'black'
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color:'black'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
    color:'black'
  },
  navBarLeftButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    flex: 1,
    paddingRight: '40px',
    textAlign: 'center',
    color:'black'
  },
  headerTitulo:{
    textAlign: 'center',
    padding: 10,
    width:'100%',
  }
});

export default TextToSpeech;