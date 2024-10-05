import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, ToastAndroid } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import  {default as _apiServices} from '../../tools/api';

const AudioRecorderComponent = ({setModalVisible,req}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [base64Audio, setBase64Audio] = useState(''); // Almacena el audio en base64

  // Método para comenzar la grabación
  const onStartRecord = async ({setModalVisible,req}) => {
    setIsRecording(true);
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      return;
    });
    console.log(result);
  };

  // Método para detener la grabación
  const onStopRecord = async () => {
    try {
        const result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();

        const base64String = await RNFS.readFile(result, 'base64');
        
        setBase64Audio(base64String);

        setRecordTime('00:00:00');
        setIsRecording(false);
        console.log(result);
        
    } catch (error) {
        console.log(error)
    }
  };

  // Método para reproducir el audio grabado
  const onStartPlay = async () => {
    setIsPlaying(true);
    console.log('onStartPlay');
    const result = await audioRecorderPlayer.startPlayer();
    audioRecorderPlayer.addPlayBackListener((e) => {
      setCurrentPositionSec(e.currentPosition);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
      return;
    });
    console.log(result);
  };

  // Método para detener la reproducción
  const onStopPlay = async () => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(false);
  };

  const save = async () => {

    var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
    usuario = JSON.parse(usuario);

    var dataRoute = req['params'];

    var params = usuario['usukides']+'|'+dataRoute['Programa']+'|'+dataRoute['params']+'|'+'audio|MP4|';
    var reponse = await _apiServices('FANEXO','Mi Appescolar','WriteAtach',params,base64Audio,'Utilerias','0');
    console.log(reponse);
    if(reponse[0] == 'OK'){
      showToast('Grabación guardada satisfactoriamente');
      setModalVisible(false);
    } else {
      showToast('Error al guardar')
    }

  }
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grabadora de Audio</Text>
      
      <View style={styles.recordSection}>
        <Button
          title={isRecording ? 'Detener Grabación' : 'Iniciar Grabación'}
          onPress={isRecording ? onStopRecord : onStartRecord}
          color={isRecording ? 'red' : 'green'}
        />
        <Text style={styles.timer}>{recordTime}</Text>
      </View>

      <View style={styles.playSection}>
        <Button
          title={isPlaying ? 'Detener Reproducción' : 'Reproducir Audio'}
          onPress={isPlaying ? onStopPlay : onStartPlay}
          color={isPlaying ? 'red' : 'blue'}
        />
        <Text style={styles.timer}>{`${playTime} / ${duration}`}</Text>
      </View>

    <View style={styles.container}>
        <Button title='Enviar' onPress={save} />
    </View>    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'black'
  },
  recordSection: {
    marginVertical: 20,
  },
  playSection: {
    marginVertical: 20,
  },
  timer: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
    color:'black',
    textAlign:'center'
  },
});

export default AudioRecorderComponent;