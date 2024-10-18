import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import  {default as _apiServices} from './api';

import ProgramPage from '../../pages/program';
import AsyncStorage from '@react-native-async-storage/async-storage';
const OpenProgram =  ({ route, navigation }) => {

    const { Programa, OPMESSAGE, OPFORMA, COVERSIONTO, Params, Opcion, TipoAcceso, COTIPO, dataSelect, TIPO,BACKPROGRAM,BACKFORMA } = route.params;
    const [showPrm, setShowPrm] = useState(false);

    const openBForUBE = async (tipo) => {
      try {
        var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
        usuario = JSON.parse(usuario)
        if(tipo == 'BF'){
          let bfParams = await _apiServices('program','','INTERCONECT',[{action:"I",Data:'PLOTE|WLOTEA|'+Programa+'|||'}],{},'Mi App','0');
          //console.log('rParams',bfParams);
          let campos = '';
          for (let index = 0; index < bfParams.length; index++) {
              const element = bfParams[index];
              if(index == 0){
                  campos = campos + '@' + element['PPCAMPOTO'] + ':' + dataSelect[element['PPCAMPOFROM']];
              }else{
                  campos = campos + ',@' + element['PPCAMPOTO'] + ':' + dataSelect[element['PPCAMPOFROM']];
              }
          }
          let params = usuario['usukides']+'|'+usuario['ususer']+'|'+BACKPROGRAM+'|'+BACKFORMA+'|ItemNumber|'+campos+'||';
          let response = await await _apiServices('FUNC','Mi Appescolar','Executefunction',params,'','Utilerias','0');
          navigation.goBack()
        }else{
          let bfParams = await _apiServices('program','','INTERCONECT',[{action:"I",Data:'PLOTE|WLOTEA|'+Programa+'||'+COVERSIONTO+'|'}],{},'Mi App','0');
          let campos = '';
          for (let index = 0; index < bfParams.length; index++) {
              const element = bfParams[index];
              if(index == 0){
                  campos = campos + '@' + element['PPCAMPOTO'] + '|1|1|' + dataSelect[element['PPCAMPOFROM']] + '|';
              }else{
                  campos = campos + '@' + element['PPCAMPOTO'] + '|1|1|' + dataSelect[element['PPCAMPOFROM']]+'|';
              }
          }
          let params = campos;
          //let params = '@ALITEM|1|1|MC0001|@ALBARCODE|1|1|12345678|';
          let response = await await _apiServices('FUNCUBE',Programa,'ExecuteReport',params,'','Utilerias','0');
          navigation.goBack()

        }
        
      } catch (error) {
        console.log(error)
      }

      
    }

    useEffect(() => {
        

        const alert = async () => {
          try {
            if(OPMESSAGE != ''){
              navigation.setOptions({ title: '' });
              var idioma:any = await AsyncStorage.getItem('idioma');
              let parm = OPMESSAGE+'|'+idioma+'|';
              const response = await _apiServices('program','','MESSAGE',[{action:"I",Data:parm}],{},'Mi App','0');
                if(response.length > 0){
                    Alert.alert(response[0]['METITLE'], response[0]['MEMESSAGE'], [
                        {
                          text: response[0]['MECANCEL'],
                          onPress: () => navigation.goBack(),                          
                          style: 'cancel',
                        },
                        {text: response[0]['MEOK'], onPress: () => {
                            if(COTIPO == 'BF'){
                              openBForUBE('BF');
                            }else{
                              if(COTIPO == 'RPT'){
                                openBForUBE('RPT');
                              }else{
                                setShowPrm(true)
                              }
                            }
                        }},
                    ]);
                }else{
                  navigation.goBack()
                }
            }else{
              if(COTIPO == 'BF'){
                openBForUBE('BF');
              }else{
                if(COTIPO == 'RPT'){
                  openBForUBE('RPT');
                }else{
                  setShowPrm(true)
                }
              }

            }
          } catch (error) {
            console.error('Error fetching buttons:', error);
          }
        };
    
        alert();
      }, []);

    return(
        <View style={{color:'black'}}>
            {(showPrm &&(
              <ProgramPage Programa={Programa} OPFORMA={OPFORMA} COVERSIONTO={COVERSIONTO} Params={Params} Opcion={Opcion} TipoAcceso={TipoAcceso} TIPO={TIPO}/>
            ))}
        </View>
    )
}

export default OpenProgram;