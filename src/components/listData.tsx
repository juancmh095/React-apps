import React, { useEffect, useState } from 'react';
import  {default as _apiServices} from './tools/api';
import { CheckBox, Icon, Text } from 'react-native-elements';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { ListItem,Button } from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListDataModule = (props) => {
    const [labelsArry, setLabelsArry] = React.useState([]);
    const [labels, setLabel] = React.useState([]);
    const [checked, setChecked] = React.useState([]);
    

    const getLabelsData = async ()=> {
        let r = '2|22|'+props['Programa']+'|E|'+props['OPFORMA'];
        const response = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:r}],{},'Mi App','0');
        var lbs = {};
        var dArr = [];
        for (let i = 0; i < response.length; i++) { 
            const element = response[i];
            lbs[element.UDCAMPO] = element.UDDESCRIPCION
            let fil = dArr.filter(item => item == element.UDCAMPO);
            if(fil.length == 0){
                dArr.push(element.UDCAMPO);
            }
        }
        setLabel({...lbs});
        setLabelsArry([...dArr]);
    }


    const deleteItem = async (item,i) => {
        let params:any;
        var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
        var idioma = await AsyncStorage.getItem('idioma');
        usuario = JSON.parse(usuario)
        if(props['Params']){
            params = props['Params'];
        }else{
            let response = await _apiServices('program','','INTERCONECT',[{action:"I",Data:props['Programa']+'|'+props['OPFORMA']+'|'+props['Programa']+'|'+'WLOTEB'+'||'}],{},'Mi App','0');
            params = response;    
        }

        let tAlert = await _apiServices('program','','MESSAGE',[{action:"I",Data:'DELWLOTEA|'+idioma+'|'}],{},'Mi App','0');

        Alert.alert(tAlert[0]['METITLE'], tAlert[0]['MEMESSAGE'], [
            {
              text: tAlert[0]['MECANCEL'],
              onPress: () => console.log('cancelado'),                          
              style: 'cancel',
            },
            {text: tAlert[0]['MEOK'], onPress: async () => {
                let deleteData = '';
                for (let i = 0; i < params.length; i++) {
                    const element = params[i];
                    deleteData = item[element['PPCAMPOTO']] + '|';
                }
                let deleteItem = await _apiServices('program','','PLOTE',[{action:"D",Data:'D|'+usuario['usukides']+'|'+deleteData}],{},'Mi App','0');
                 
                var itemsData = props['dataList'];
                var realData = itemsData.splice(i,1);
                props['setListDataSelect']([...realData]);
            }},
        ]);

        
    }

    const openAction = async (program,index) => {
        console.log(program,index)
    }

    const OpenURLButton = async (url) => {
    
        await Linking.openURL(url);
        
    }

    useEffect(()=>{
        getLabelsData();
    },[])

    return (
        <View style={{color:'black'}}>
            {props['dataList'].map((item,i) => {
                return(
                <ListItem.Swipeable
                    key={i + '-LIST'}
                    onLongPress={()=> openAction(item['LOITEM'],0)}
                    style={{borderWidth:3, borderColor:'#E1E1E1', margin:5, borderRadius:5}}
                    rightContent={(reset) => (
                    <Button
                        title="Borrar"
                        onPress={() => deleteItem(item,i)}
                        icon={{ name: 'delete', color: 'white' }}
                        buttonStyle={{ minHeight: '85%', backgroundColor: 'red', margin:5 }}
                    />
                    )}
                >
                
                    <CheckBox
                        checked={checked === i}
                        onPress={() => {
                            setChecked(i);
                            props['setListDataSelect']({...item});
                        }}
                    />
                    <ListItem.Content>
                    {labelsArry.map((label,x) => {
                        return(
                        <ListItem.Title key={label+x+i}>
                            <Text style={{fontWeight:900}}>{labels[label]}: </Text> {item[label]} 
                            
                        </ListItem.Title>
                        )
                    })}
                    </ListItem.Content>
                    {(item['JBPATH'] && (item['JBPATH']).includes('.pdf') && (
                        <Icon name='file-pdf-o' size={40} type="font-awesome" onPress={()=> OpenURLButton(item['JBPATH'])} />
                    ))}
                    {(item['JBPATH'] && ((item['JBPATH']).includes('.xlsx') || (item['JBPATH']).includes('.xls') || (item['JBPATH']).includes('.csv')) && (
                        <Icon name='file-excel-o' size={40} type="font-awesome" onPress={()=> OpenURLButton(item['JBPATH'])} />
                    ))}
                    <ListItem.Chevron />
                </ListItem.Swipeable>

                )
            })}

        </View>
    )
}

export default ListDataModule;