import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import  {default as _apiServices} from './api';

import ProgramPage from '../../pages/program';

const OpenProgram =  ({ route, navigation }) => {

    const { Programa, OPMESSAGE, OPFORMA, COVERSIONTO, Params, Opcion } = route.params;
    const [showPrm, setShowPrm] = useState([]);

    useEffect(() => {
        

        const alert = async () => {
          try {
            console.log('alert',OPMESSAGE,route.params);
            if(OPMESSAGE != ''){
                const response = await _apiServices('program','','MESSAGE',[{action:"I",Data:'IMPFACT|1|'}],{},'Mi App','0');
                console.log(response);
                if(response.length > 0){
                    Alert.alert(response[0]['METITLE'], response[0]['MEMESSAGE'], [
                        {
                          text: response[0]['MECANCEL'],
                          onPress: () => setShowPrm(true),                          
                          style: 'cancel',
                        },
                        {text: response[0]['MEOK'], onPress: () => {
                            setShowPrm(true)
                        }},
                    ]);
                }else{
                    setShowPrm(true)
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
            <ProgramPage Programa={Programa} OPFORMA={OPFORMA} COVERSIONTO={COVERSIONTO} Params={Params} Opcion={Opcion} />
        </View>
    )
}

export default OpenProgram;