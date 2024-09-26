import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Text } from 'react-native-elements';
import { ButtonGroup, Icon } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    const action = async (id) => {
      var form = props['form'];
      var usuario:any = await AsyncStorage.getItem('FUSERSLOGIN');
      usuario = JSON.parse(usuario)
      console.log(props['data']['OPFORMA'],props['data']['Programa'])
      if(id == 2){
        console.log(form['current']['values']);
        let dataForm = form['current']['values'];
        var keysObject = Object.keys(form['current']['values']);
        let campos = '';
        for (let i = 0; i < keysObject.length; i++) {
          const element = keysObject[i];
            if(i == 0){
                campos = campos + '@' + keysObject[i] + ':' + dataForm[keysObject[i]];
            }else{
                campos = campos + '@' + keysObject[i] + ':' + dataForm[keysObject[i]];
            }
        }
        let r = '2|22|'+props['data']['Programa'] + '|F|' + props['data']['OPFORMA'] + '|' + props['data']['COVERSIONTO'] + '|' + campos + '|';
        console.log(r);
        const data = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:r}],{},'Mi App','0');
        console.log(data);
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