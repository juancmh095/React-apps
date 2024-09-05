import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Text } from 'react-native-elements';
import { ButtonGroup } from '@rneui/base';

const TopbarModule = ({props}) => {

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
    const [buttonsCode, setButtonsCode] = useState([]);

    useEffect(() => {
        // Función para obtener los botones desde la API
        const fetchButtons = async () => {
          try {
            console.log(_apiServices)
            var btn = [];
            const response = await _apiServices('program','','INQBARRA',[{action:"I",Data:"0|1|"}],{},'Mi App','0');
            for (let i = 0; i < response.length; i++) {
              const element = response[i];
              btn.push(element['Titulo']);
            }
            setButtons([...btn])
            console.log(response);
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
              }}
              containerStyle={{ marginBottom: 20 }}
            />
        </View>
    )
}

export default TopbarModule;