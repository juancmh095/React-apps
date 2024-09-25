import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import  {default as _apiServices} from './tools/api';
import { Icon, Text } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '@rneui/base';
import { Picker } from '@react-native-picker/picker';
import QRComponent from './tools/code.tsx' ;
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const FormsComponent = (props) => {

    const [inputs, setInputs] = useState([]);
    const [lote, setLote] = useState('');
    const [modalVisible2, setModalVisible2] = useState(false);
    const [datePk, setDatePk] = React.useState(new Date())

    const changeDateTime = (setFieldValue,campo, value, event) => {
        if(event.type == 'set'){
          if(campo == 'LODATRECEIP' || campo == 'JBSBMDATE'){
            let dt = new Date(value);
            dt = dt.toLocaleDateString('es-MX').split('/');
            dt = (Number(dt[0])<9?('0'+dt[0]):dt[0]) + '/' + (Number(dt[1])<9?('0'+dt[1]):dt[1]) + '/' + (Number(dt[2])<9?('0'+dt[2]):dt[2]);
            setFieldValue(campo,dt);
          }else{
            let dt = new Date(value);
            let hora = dt.toLocaleTimeString('es-MX').split(' ')[0];
            setFieldValue(campo,hora);
          }
        }
      }

    useEffect(() => {
        

        const fetchButtons = async () => {
          try {
            var usuario:any = await AsyncStorage.getItem('FUSERSLOGIN');
            usuario = JSON.parse(usuario)
            console.log('program',props['program'])
            const response = await _apiServices('program','','INQFORMNAME',[{action:"I",Data:usuario['usukides']+'|'+props['program']+'|'}],{},'Mi App','0');
            console.log('esta es la forma',response)
            if(response.length > 0){
                var dta = "0|"+usuario['usukiduser']+'|'+props['program']+'|A|'+response[0]['OPFORMDEFAULT']+'|'+props['item']+'|';
                const responseForm = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:dta}],{},'Mi App','0');
                console.log('esta es la forma', responseForm);
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
            }
          } catch (error) {
            console.log('Error fetching buttons:', error);
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
                                    rightIcon = {<Icon name='close' onPress={()=> props['form'].current.setFieldValue(item.UDCAMPO,'')} />}
                                    containerStyle={{margin:0, padding:0, height:50}}
                                    inputContainerStyle={{borderBottomWidth:0}}
                                    returnKeyType="next"
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
                                        rightIcon = {<Icon name='qr-code' onPress={()=> setModalVisible2(true) } />}
                                        maxLength={Number(item.UDLONGITUD)}
                                        clearButtonMode='always'
                                        returnKeyType="next"
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
                                                placeholder={item.UDDESCRIPCION+''} 
                                                style={styles.formControl}
                                                containerStyle={{margin:0, padding:0, height:50}}
                                                inputContainerStyle={{borderBottomWidth:0}}
                                                maxLength={Number(item.UDLONGITUD)}
                                                rightIcon = {<Icon name='close' onPress={()=> props['form'].current.setFieldValue(item.UDCAMPO,'')} />}
                                                onFocus={()=> DateTimePickerAndroid.open({mode:'date', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(props['setFieldValue'],item.UDCAMPO,value,event)} })}
                                                onChangeText={props['handleChange'](item.UDCAMPO)}
                                                returnKeyType="next"
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
                                                    rightIcon = {<Icon name='close' onPress={()=> props['form'].current.setFieldValue(item.UDCAMPO,'')} />}
                                                    onFocus={()=> DateTimePickerAndroid.open({mode:'time', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(props['setFieldValue'],item.UDCAMPO,value,event)} })}
                                                    onChangeText={props['handleChange'](item.UDCAMPO)}
                                                    returnKeyType="next"
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
                <Modal
                    style={{width:'100%',height:'100%'}}
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible2}
                >
                    <View>
                    <View>
                        <QRComponent setModalVisible={setModalVisible2} lote={lote} setLote={setLote} form={props['form']} />                
                    </View>
                    </View>
                </Modal>
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