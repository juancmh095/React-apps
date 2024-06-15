import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, PermissionsAndroid, Platform, TextInput } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceToText = () => {
  const [recognized, setRecognized] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    console.log('inicia voice')
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e) => {
    setStarted('Cargando...');
  };

  const onSpeechEnd = (e) => {
    setStarted('');
  };

  const onSpeechRecognized = (e) => {
    setRecognized('Grabando...');
  };

  const onSpeechResults = (e) => {
    console.log(e);
    const regex = /[\[,",\]]/gm;
    var data = JSON.stringify(e.value);
    const result = data.replace(regex, '');
    setResults(result);
  };

  const onSpeechError = (e) => {
    console.error(e);
  };

  const startRecognizing = async () => {
    try {
      await Voice.start('es-MX');
      setRecognized('');
      setStarted('');
      setResults([]);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
      setRecognized('');
      setStarted('');
      setResults([]);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestMicrophonePermission();
    }
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to recognize your speech.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Microphone permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stat}>{started}</Text>
      <Text style={styles.stat}>{recognized}</Text>
      <Text style={styles.stat}>Resultado:</Text>
      <View style={{borderWidth:1, borderBlockColor:'gray', marginBottom:30}}>
        <TextInput
            style={styles.textArea}
            underlineColorAndroid="transparent"
            placeholder="Resultado"
            placeholderTextColor="grey"
            numberOfLines={10}
            multiline={true}
            value={results}
            />

      </View>
      <View style={{marginBottom:10}}>
        <Button title="Iniciar" onPress={startRecognizing} />
      </View>
      <View style={{marginBottom:10}}>
        <Button title="Detener" onPress={stopRecognizing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:500,
    color:'black',
    width:'80%',
    marginLeft:'auto',
    marginRight:'auto'
  },
  stat: {
    textAlign: 'center',
    marginBottom: 8,
    color:'black'
  },
  resultText: {
    textAlign: 'center',
    marginTop: 8,
    color:'black'
  },
  btn:{
    margin:10
  },
  textAreaContainer: {
    borderColor: 'black',
    borderWidth: 4,
    padding: 5
  },
  textArea: {
    height: 150,
    color:'black',
    justifyContent: "flex-start"
  }
});

export default VoiceToText;