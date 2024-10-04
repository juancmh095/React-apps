import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Text } from 'react-native-elements';
import { ButtonGroup, Icon } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContext } from '@react-navigation/native';

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
    const navigation = React.useContext(NavigationContext);

    const action = async (id) => {
      console.log('idddddddddd',id)
      var form = props['form'];
      var usuario:any = await AsyncStorage.getItem('FUSERSLOGIN');
      usuario = JSON.parse(usuario)
      console.log(props['data']['OPFORMA'],props['data']['Programa'],id)
      if(id == 2){
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
        const data = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:r}],{},'Mi App','0');
        props['setListData']([...data]);
      }

      if(id == 4){
        try {
          var campos='';
          if(Object.keys(props['listDataSelect']).length > 0){
            if(props['data']['Programa'] == 'PLOTE'){
              let r = props['data']['Programa'] + '|' + props['data']['OPFORMA'] + '|' + props['data']['Programa'] + '|' + props['data']['OPFORMA'] +'|';
              let paramsProgram = await _apiServices('program','','INTERCONECT',[{action:"I",Data:r}],{},'Mi App','0');
              for (let index = 0; index < paramsProgram.length; index++) {
                const element = paramsProgram[index];
                if(index == 0){
                    campos = campos + '@' + element['PPCAMPOTO'] + ':' + props['listDataSelect'][element['PPCAMPOFROM']];
                }else{
                    campos = campos + ',@' + element['PPCAMPOTO'] + ':' + props['listDataSelect'][element['PPCAMPOFROM']];
                }
              }
    
            }else{
              let r = 'PLOTE|WLOTEA|' + props['data']['Programa'] + '|' + props['data']['OPFORMA'] +'|';
              let paramsProgram = await _apiServices('program','','INTERCONECT',[{action:"I",Data:r}],{},'Mi App','0');
              for (let index = 0; index < paramsProgram.length; index++) {
                const element = paramsProgram[index];
                if(index == 0){
                    campos = campos + '@' + element['PPCAMPOTO'] + ':' + props['listDataSelect'][element['PPCAMPOFROM']];
                }else{
                    campos = campos + ',@' + element['PPCAMPOTO'] + ':' + props['listDataSelect'][element['PPCAMPOFROM']];
                }
              }
            }
            let params = {
              params: campos,
              Programa: props['data']['Programa'],
              OPFORMA: props['data']['OPFORMA'],
              COVERSIONTO: props['data']['COVERSIONTO']
            }
            navigation.push('Mis_Anexos',params)
          }
        } catch (error) {
            console.log(error);
        }
        
      }


     
    }

    useEffect(() => {
        // Función para obtener los botones desde la API
        console.log('propstopbar',props)
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
                if(props['TipoAcceso'] == '1'){
                  action((value+1))
                }
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