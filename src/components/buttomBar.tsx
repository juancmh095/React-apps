import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Text } from 'react-native-elements';
import { ButtonGroup } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ButtomBarModule = (props) => {
    var icons = 
    { 
        1:'check',
        2:'search',
        3:'add',
        4:'close'
    }
    var iconsColor = 
    {
        1:'green',
        2:'blue',
        3:'green',
        4:'red'
    }
    const [buttons, setButtons] = useState([]);
    const [options, setOptions] = useState([]);
    const [buttonsCode, setButtonsCode] = useState([]);

    useEffect(() => {
        // Función para obtener los botones desde la API
        const fetchButtons = async () => {
          try {
            var btn = [];

            var usuario:any = await AsyncStorage.getItem('FUSERSLOGIN');
            usuario = JSON.parse(usuario)
            const response = await _apiServices('program','','BARRAPROGRAM',[{action:"I",Data:usuario['usukides']+"|"+props['program']+"|"+props['OPFORMA']+"|B|1|"}],{},'Mi App','0');
        
            setOptions([...response]);
            for (let i = 0; i < response.length; i++) {
              const element = response[i];
              btn.push(element['OPTITULO']?element['OPTITULO']:element['NOMBREPGM']);
            }
            setButtons([...btn])
          } catch (error) {
            console.error('Error fetching buttons:', error);
          }
        };
    
        fetchButtons();
      }, []);

    return (
        <View>
            <ButtonGroup
              buttons={buttons}
              buttonStyle={{backgroundColor:'#E1E1E1'}}
              buttonContainerStyle={{borderColor:'gray'}}
              onPress={(value) => {
                console.log(value);
                console.log(options[value]);
              }}
              containerStyle={{ marginBottom: 20 }}
            />
        </View>
    )
}

export default ButtomBarModule;