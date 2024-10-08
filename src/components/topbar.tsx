import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Text } from 'react-native-elements';
import { ButtonGroup, Icon } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContext } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';

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

      if(id==1){

        let r = usuario['usukiduser']+'|'+usuario['ususer']+'|'+ props['data']['Programa'] + '|U|WLOTEB' +'|'+props['listDataSelect']['LOITEM']+'|';
        let response = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:r}],{},'Mi App','0');
        console.log(response);

        let campos = '';
        let oKeys = Object.keys(response[0]);
        for (let index = 0; index < oKeys.length; index++) {
            const element = oKeys[index];
            if(index == 0){
                campos = campos + '@' + element + ':' + response[0][element];
            }else{
                campos = campos + ',@' + element + ':' + response[0][element];
            }
        }
        let dataProgram = {
            COVERSIONTO:props['data']['COVERSIONTO'], 
            OPFORMA:props['data']['OPFORMA'], 
            Programa:props['data']['Programa'],
            Params:campos, 
            OPMESSAGE:'', 
            'Opcion':'Mantenimiento de Lotes', 
            dataSelect:props['listDataSelect'],
            COTIPO:'APP',
            TIPO:'U'
        }
        console.log(dataProgram);
        navigation.push('Program',dataProgram)

      }

      if(id==3){
        let r = usuario['usukiduser']+"|"+ props['data']['Programa'] +"|A|F|@0@"+props['listDataSelect']['LOITEM']+"|";
        let response = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:r}],{},'Mi App','0');
        console.log(response);

        let dataProgram = {
          COVERSIONTO:props['data']['COVERSIONTO'], 
          OPFORMA:props['data']['OPFORMA'], 
          Programa:props['data']['Programa'],
          Params:'', 
          OPMESSAGE:'', 
          'Opcion':'Mantenimiento de Lotes', 
          dataSelect:props['listDataSelect'],
          COTIPO:'APP',
          TIPO:'A'
        }
        console.log(dataProgram);
        navigation.push('Program',dataProgram)

      }


     
    }

    const action2 = async (id) => {
      console.log(id);
      if(id==2){
        navigation.goBack()
      }
      
      if(id==1){
        var usuario:any = await AsyncStorage.getItem('FUSERSLOGIN');
        usuario = JSON.parse(usuario)
        console.log(props['data']['TIPO']);

        var form = props['form'];
        let dispositivo = DeviceInfo.getDeviceNameSync();
        let dateDevice = new Date().toLocaleDateString('es-MX').split('/');
        let timeDevice = new Date().toLocaleTimeString('es-MX').split(' ')[0];
        let fechaD = dateDevice[0]+((Number(dateDevice[1])<9)?'0'+dateDevice[1]:dateDevice[1])+dateDevice[2];
        let rgx = /[:,/]/gm;
        let horaD = timeDevice.replace(rgx,'');
        var lte = form['current']['values'];
        console.log(dateDevice,fechaD,horaD);

        if(props['data']['TIPO'] == 'U'){
          const regex = /[:,/]/gm;
          let dta = lte.LODATRECEIP.replace(regex,'');
          let r = 'U|0|' + lte.LOITEM+'|'+lte.LOBARCODE+'|'+lte.LOCAT1+'|'+lte.LOCAT2+'|'+dta+'|'+lte.LOTIMEREC+'|'+usuario['usukiduser']+'|'+dispositivo+'|'+props['data']['Programa']+'|'+fechaD+'|'+horaD+'|'
          
          let response = await _apiServices('GLOTE','FLOTE','ValidateInfo',r,{},'Utilerias','0');
          console.log(response)
          if(response[0] === 'OK'){
              ToastAndroid.show('Actualizado correctamente', ToastAndroid.LONG);
              navigation.goBack()
          }else{
              //setErrors(JSON.stringify(guardar.data.Json))
          }
        }else{
          const regex = /[:,/]/gm;
          let dta = lte.LODATRECEIP.replace(regex,'');
          r = 'A|0|' + lte.LOITEM+'|'+lte.LOBARCODE+'|'+lte.LOCAT1+'|'+lte.LOCAT2+'|'+dta+'|'+lte.LOTIMEREC+'|'+usuario['usukiduser']+'|'+dispositivo+'|'+props['data']['Programa']+'|'+fechaD+'|'+horaD+'|'
          let response = await _apiServices('GLOTE','FLOTE','ValidateInfo',r,{},'Utilerias','0');
          console.log(response)
          if(response[0] === 'OK'){
              ToastAndroid.show('Item Guardado correctamente', ToastAndroid.LONG);
              form['current']['resetForm']({})
          }else{
              //setErrors(JSON.stringify(guardar.data.Json))
          }
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
            {((props['data']["TIPO"] == null)&&(
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
            ))}
            {((props['data']["TIPO"] != null)&&(
              <ButtonGroup
                buttons={['OK','Cancelar','Errores']}
                buttonStyle={{backgroundColor:'#E1E1E1'}}
                buttonContainerStyle={{borderColor:'gray'}}
                onPress={(value) => {
                  
                  action2((value+1))
                }}
                containerStyle={{ marginBottom: 20 }}
              />
            ))}
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