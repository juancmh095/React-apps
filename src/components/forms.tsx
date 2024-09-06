import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Text } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';

const FormsComponent = (props) => {

    const [inputs, setInputs] = useState([]);

    useEffect(() => {
        

        const fetchButtons = async () => {
          try {
            var usuario:any = await AsyncStorage.getItem('FUSERSLOGIN');
            usuario = JSON.parse(usuario)
            console.log(props,usuario)
            const response = await _apiServices('program','','INQFORMNAME',[{action:"I",Data:usuario['usukides']+'|'+props['program']+'|'}],{},'Mi App','0');
       
            var dta = "0|"+usuario['usukiduser']+'|'+props['program']+'|A|'+response[0]['OPFORMDEFAULT']+'|'+props['item']+'|';
            const responseForm = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:dta}],{},'Mi App','0');
            /* aqui se llenan los inputs de formulario */
            /* recorremos todos para saber cual es de tipo S que es un select */
            for (let i = 0; i < responseForm.length; i++) {
                const element = responseForm[i];
                if(element['UDTIPO'] == 'S'){
                    element['VALORES'] = [];
                    let dtaCat = "0|"+element['UDUDC']+"|1|"
                    let respDataSelect = await _apiServices('program','','PGMINQUIRY',[{action:"I",Data:dtaCat}],{},'Mi App','0');
                    element['VALORES'] = respDataSelect;
                }
                
            }
            setInputs([...responseForm]);
          } catch (error) {
            console.error('Error fetching buttons:', error);
          }
        };
    
        fetchButtons();
      }, []);

    return (
        <View>
            <View>
                    {inputs.map((item,i)=>{
                        if(item.UDUDC == "" && item.UDTIPO != "T" && item.UDTIPO != "D"){
                            return(
                                <Input 
                                    placeholder={item.UDDESCRIPCION} 
                                    maxLength={Number(item.UDLONGITUD)}
                                    value={props['values'][item.UDCAMPO]}
                                    style={styles.formControl}
                                    containerStyle={{margin:0, padding:0, height:50}}
                                    inputContainerStyle={{borderBottomWidth:0}}
                                    onChangeText={props['handleChange'](item.UDCAMPO)}
                                />
                            )
                        }else{
                            if(item.UDUDC == "QR"){
                                return(
                                    <Input
                                        placeholder={item.UDDESCRIPCION} 
                                        style={styles.formControl}
                                        containerStyle={{margin:0, padding:0, height:50}}
                                        inputContainerStyle={{borderBottomWidth:0}}
                                        rightIcon={{ type: 'ionicon', name: 'barcode-outline', size:40 }}
                                        maxLength={Number(item.UDLONGITUD)}
                                        onFocus={()=> setModalVisible2(true)}
                                        value={props['values'][item.UDCAMPO]}
                                        onChangeText={props['handleChange'](item.UDCAMPO)}
                                    />
                                )
                            }else{
                                if(item.UDTIPO == "S"){
                                    return(
                                        <View style={styles.select}>
                                            <Picker
                                                style={{color:'black'}}
                                                selectedValue={props['values'][item.UDCAMPO]}
                                                style={styles.formControlSelect}
                                                onValueChange={props['handleChange'](item.UDCAMPO)}
                                            >
                                                <Picker.Item label='Categoria 1' value='' />
                                                {item['VALORES'].map((item) => {
                                                    return(
                                                        <Picker.Item label={item.Valor} value={item.Valor} />
                                                    )
                                                })}
                                            </Picker> 
                                        </View>
                                    )
                                }else{
                                    if(item.UDTIPO == "D"){
                                        return(
                                            <Input 
                                                key={item.UDCAMPO}
                                                placeholder={item.UDDESCRIPCION} 
                                                style={styles.formControl}
                                                containerStyle={{margin:0, padding:0, height:50}}
                                                inputContainerStyle={{borderBottomWidth:0}}
                                                maxLength={Number(item.UDLONGITUD)}
                                                onFocus={()=> DateTimePickerAndroid.open({mode:'date', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(setFieldValue,item.UDCAMPO,value,event)} })}
                                                onChangeText={props['handleChange'](item.UDCAMPO)}
                                                value={props['values'][item.UDCAMPO]}
                                            />
                                        )
                                    }else{
                                        if(item.UDTIPO == "T"){
                                            return(
                                                <Input 
                                                    key={item.UDCAMPO}
                                                    placeholder={item.UDDESCRIPCION} 
                                                    style={styles.formControl}
                                                    containerStyle={{margin:0, padding:0, height:50}}
                                                    inputContainerStyle={{borderBottomWidth:0}}
                                                    maxLength={Number(item.UDLONGITUD)}
                                                    onFocus={()=> DateTimePickerAndroid.open({mode:'time', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(setFieldValue,item.UDCAMPO,value,event)} })}
                                                    onChangeText={props['handleChange'](item.UDCAMPO)}
                                                    value={props['values'][item.UDCAMPO]}
                                                /> 
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    })}
                    
                    <View>
                    </View>
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    formControl:{
        margin:0,
        padding:7,
        borderColor:'gray',
        borderRadius:5,
        borderWidth:1
      },
      formControlSelect:{
        margin:0,
        padding:7,
        color:'black',
        borderColor:'gray',
        borderRadius:5,
        borderWidth:1,
        backgroundColor:'#E1E1E1'
      }
});


export default FormsComponent;