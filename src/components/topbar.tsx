import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Text } from 'react-native-elements';
import { ButtonGroup, Icon } from '@rneui/base';

const TopbarModule = (props) => {

    var icons = 
    { 
        1:'check',
        2:'search',
        3:'add',
        4:'close',
        5:'upload-file'
    }
    var iconsColor = 
    {
        1:'green',
        2:'blue',
        3:'green',
        4:'red'
    }
    const [buttonsTop, setButtonsTop] = useState([]);
    const [buttonsCode, setButtonsCode] = useState([]);

    const action = (id) => {
      var form = props['form'];
      if(id == 2){
        console.log(form['current']['values']);
      }
    }

    useEffect(() => {
        // Función para obtener los botones desde la API
        const fetchButtons = async () => {
          try {
            var btn = [];
            const response = await _apiServices('program','','INQBARRA',[{action:"I",Data:"0|1|"}],{},'Mi App','0');
            for (let i = 0; i < response.length; i++) {
              const element = response[i];
              btn.push(<View style={styles.navBarLeftButton}><Icon name={icons[element.Id]} color={iconsColor[element.Id]} /><Text style={styles.buttonText}>{element.Titulo}</Text></View>)        
            }
            setButtonsTop([...btn])
          } catch (error) {
            console.error('Error fetching buttons:', error);
          }
        };
    
        fetchButtons();
      }, []);

    return (
        <View>
            <ButtonGroup
              buttons={buttonsTop}
              buttonStyle={{backgroundColor:'#E1E1E1'}}
              buttonContainerStyle={{borderColor:'gray'}}
              onPress={(value) => {
                action((value+1))
              }}
              containerStyle={{ marginBottom: 20 }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
  navBarLeftButton: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default TopbarModule;