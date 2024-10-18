import React, { useEffect, useRef, useState } from "react";
import { BackHandler, Modal, ScrollView, StyleSheet, View } from "react-native";
import { ButtonGroup, TabView, Text } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "../../services/Storage";

import * as rqdata from '../../components/tools/params_request';
import axios from "axios";
import { Input, Icon } from '@rneui/themed';
import { Formik } from "formik";
import { ListItem, Tab, Button, Card } from "@rneui/base";
import  {default as _apiServices} from '../../components/tools/api';

import  QuillComponent from '../../components/anexos/plugins/QuillOc';

const OrdenCompraComponent =  ({ navigation }) => {


    const [usuario, setUsuario] = React.useState(null);
    const [index, setIndex] = React.useState(0);
    const [dataInfo, setDataInfo] = React.useState([]);
    const [form, setForm] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [errores, setErrores] = React.useState([]);
    const [formValues, setFormValues] = React.useState({});
    const [botones, setBtn] = React.useState([]);
    const [labels, setLabels] = React.useState({});
    const [labelsArry, setLabelsArry] = React.useState([]);
    const [labelsErr, setLabelsErr] = React.useState({});
    const [labelsArryErr, setLabelsArryErr] = React.useState([]);
    const [tabs, setTabs] = React.useState([]);
    const [tabSelect, setTabSelect] = React.useState('');
    const [titulo, setTitulo] = React.useState('');
    const [count, setCount] = React.useState(1);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisible2, setModalVisible2] = React.useState(false);

    const [textBase64, setTextBase64] = React.useState('');

    const [reqData, setReq] = React.useState({});

    

    var url_api="";
    const formikRef = useRef();


    const getDataInfo = async (user)=>{
        try {

            var usuario:any = await AsyncStorage.getItem('FUSERSLOGIN');
            usuario = JSON.parse(usuario)
            const response = await _apiServices('program','','INQFORMNAME',[{action:"I",Data:usuario['usukides']+'|PCOMPRAS|'}],{},'Mi App','0');
            console.log(response);
            if(response.length > 0){
                var dta = "0|"+usuario['usukiduser']+'|PCOMPRAS|A|'+response[0]['OPFORMDEFAULT']+'|MC0001|';
                const responseForm = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:dta}],{},'Mi App','0');
                /* aqui se llenan los inputs de formulario */
                /* recorremos todos para saber cual es de tipo S que es un select */
                //console.log(responseForm);
                var vals = {};
                for (let i = 0; i < responseForm.length; i++) {
                    const element = responseForm[i];
                    if(element['UDTIPO'] == 'S'){
                        element['VALORES'] = [];
                        vals[element['UDCAMPO']] = '';
                        let dtaCat = "0|"+element['UDUDC']+"|1|"
                        let respDataSelect = await _apiServices('program','','PGMINQUIRY',[{action:"I",Data:dtaCat}],{},'Mi App','0');
                        element['VALORES'] = respDataSelect;
                    }
                    /* sacar las tabs */
                    let tabsI = tabs.filter((item)=> item == element['FOTAB']);
                    if(tabsI.length <= 0){
                        tabs.push(element['FOTAB']);
                    }                    
                }

                tabs.push('Attachment');
                
                setTabs([...tabs])
                setTabSelect(tabs[0])
                setFormValues({...vals});
                setForm([...responseForm]);
            }



            /* ---------------------------------------- */
           
        } catch (error) {
            console.log('error',error);
        }
    }

    const getbotones = async (user)=>{
        try {
            console.log('entra a buscar info',user)
            let data = user['usukides'] + '|' + user['usidioma'] + '|';



            const response = await _apiServices('program','','INQBARRAFIX',[{action:"I",Data:data}],{},'Mi App','0');
            if(response.length > 0){
                var tit = [];
                var inpts = response;
                for (let i = 0; i < inpts.length; i++) {
                    const element = inpts[i];
                    tit.push(element['Titulo']);
                }

                setBtn([...tit]);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getLabelsItems = async (user)=>{
        try {
            console.log('entra a buscar info2',user)
            let data = '2|22|PCOMPRAS|E|WCOMPRASA|||';

            const response = await _apiServices('program','','ProgramInquiry',[{action:"I",Data:data}],{},'Mi App','0');
            console.log('pestanas--->',response);

            if(response.length > 0){
                let d = response;
                var lbs = {};
                var dArr = [];
                for (let i = 0; i < d.length; i++) { 
                  const element = d[i];
                  lbs[element.UDCAMPO] = element.UDDESCRIPCION
                  let fil = dArr.filter(item => item == element.UDCAMPO);
                  if(fil.length == 0){
                    dArr.push(element.UDCAMPO);
                  }
                }
                setLabels({...lbs});
                setLabelsArry([...dArr]);
              }

        } catch (error) {
            console.log(error);
        }
    }

    const getLabelsErrors = async (user)=>{
        try {
            console.log('entra a buscar info3',user)
            let data = '0|PERRORES|E|B||';
            let body = rqdata.getCarga('ProgramInquiry','I',data);
            let response = await axios.post(`${url_api}`,body);
            console.log('pestanas',response.data);

            if(response.data.Json){
                let d = JSON.parse(response.data.Json);
                var lbs = {};
                var dArr = [];
                for (let i = 0; i < d.FProgramInquiry.length; i++) { 
                  const element = d.FProgramInquiry[i];
                  lbs[element.UDCAMPO] = element.UDDESCRIPCION
                  let fil = dArr.filter(item => item == element.UDCAMPO);
                  if(fil.length == 0){
                    dArr.push(element.UDCAMPO);
                  }
                }
                setLabelsErr({...lbs});
                setLabelsArryErr([...dArr]);
              }

        } catch (error) {
            console.log(error);
        }
    }

    const getDataBtns = async ()=>{
        let url = await AsyncStorage.getItem('api');
        url_api = url;

        formikRef.current.setFieldValue('PDLNID','1');

        var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
        usuario = JSON.parse(usuario);
        getbotones(usuario);
    }

    const validateUser = async () => {
        let url = await AsyncStorage.getItem('api');
        url_api = url;
        var idIdioma = await AsyncStorage.getItem('idioma');
        var respTitulo = await axios.post(`${url_api}`, rqdata.getTitulo('PCOMPRAS','H',idIdioma));
        var ttl = respTitulo.data;
        if(ttl.Json != ''){
            var pNameJson = JSON.parse(ttl.Json);
            let pName = pNameJson['FFormName'][0];
            setTitulo(pName['FNNAME']);
        }

        var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
        usuario = JSON.parse(usuario)
        getDataInfo(usuario);
        getLabelsItems(usuario);
        getLabelsErrors(usuario);
        setUsuario({...usuario});
    }

    const validate = async ()=> {
        try {
            console.log('entra a buscar info')
            let data = 'PCOMPRAS|H|1|';

            let response = await _apiServices('program','','FormName',[{action:"I",Data:data}],{},'Mi App','0');

            console.log('validate',response);
            if(response.length > 0){
                navigation.setOptions({ title: response[0]['FNNAME'] });
                validateUser();
            }
        } catch (error) {
            console.log(error);
        }
    }

    const saveItem = async (values,resetForm) => {
        console.log(values);
        let url = await AsyncStorage.getItem('api');
        url_api = url;
        let r = 'A|0|'+values['PDDOCO']+'|'+values['PDDCTO']+'|'+values['PDLITM']+'|'+values['PDUORG']+'|'+values['PDPRRC']+'|'+textBase64+'|';
        let body = rqdata.itemOC('PCOMPRAS',r);
        let response = await axios.post(`${url_api}`,body);
        console.log(response.data);
        //falta validacion
        if(response.data.Json == 'OK'){
            let model = {};
            for (let i = 0; i < labelsArry.length; i++) {
                const element = labelsArry[i];
                model[element] = values[element]
            }

            model['PDCNID'] = textBase64;

            if(data[Number(values['PDLNID'])-1]){
                data[Number(values['PDLNID'])-1] = model;
            }else{
                data.push(model);
            }
    
            setData([...data]);

            let vals = {};
            for (let i = 0; i < form.length; i++) {
                const element = form[i];
                vals[element['UDCAMPO']] = '';
            }

            console.log(vals);
            resetForm();
            var c = count + 1;
            setCount(c);
            formikRef.current.setFieldValue('PDLNID',String(c));
            setFormValues({...vals});
            setTextBase64('');
            

        }else{
            let d = JSON.parse(response.data.Json);
            var errorx = d['FErrores'];
            setErrores(errorx);
        }
    }

    const editarItem = async (item,i) => {
        console.log(item,i)
        var obji = Object.keys(item);
        for (let i = 0; i < obji.length; i++) {
            const element = obji[i];
            formikRef.current.setFieldValue(element,item[element]);
        }
        
    }


    const handleSubmit = (values, { resetForm }) => {
        // handle form submission
        saveItem(values,resetForm)
        console.log(values)
        
      }
      

    useEffect(() => {       
        
        getDataBtns();

        return () => {
            return;
        }
    }, []);

    return (
        <View>
            <ButtonGroup
            buttons={botones}
            selectedIndex={null}
            buttonStyle={{backgroundColor:'#E1E1E1'}}
            buttonContainerStyle={{borderColor:'gray'}}
            onPress={(value) => {           
                if((botones.length -1) == value){
                    setModalVisible(true);
                }
                if(value == 0){
                    validate();
                }
            }}
            containerStyle={{ marginBottom: 20 }}
          />

    <View style={styles.headerTitulo}>
        <Text style={{textAlign:'center', fontSize:20}}>{titulo}</Text>
      </View>
          
            <ScrollView>

                <View>
                    <Tab value={index?0:index} onChange={(values)=> {
                        console.log(values);
                        if((tabs.length-1) == values){
                            let params = {
                                params: '',
                                Programa: 'PCOMPRAS',
                                OPFORMA: 'WCOMPRASB'
                            }
                            setReq({...params});
                            setModalVisible2(true)
                        }else{
                            setIndex(values);
                            setTabSelect(tabs[values]);
                        }
                    }} dense>
                        {tabs.map((item,i)=>{
                            return(
                                <Tab.Item>{item}</Tab.Item>
                            )
                        })}
                    </Tab>
                </View>

                <Formik
                    initialValues={formValues}
                    innerRef={formikRef}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, setFieldValue, handleSubmit, values }) => (
                        <View>
                            {form.map((item,i) => {
                                return(
                                    <Input 
                                        placeholder={item.UDDESCRIPCION} 
                                        value={values[item.UDCAMPO]}
                                        style={styles.formControl}
                                        disabled={(tabSelect == item['FOTAB'])?false:true}
                                        disabledInputStyle={{display:'none'}}
                                        containerStyle={(tabSelect == item['FOTAB'])?{margin:0, padding:0, height:50}:{display:'none'}}
                                        onChangeText={handleChange(item.UDCAMPO)}
                                     />
                                )
                            })}
                            <View style={{marginStart:'auto',marginEnd:'auto',marginTop:50,width:200}}>
                                {(form.length > 0 && (

                                    <Button onPress={handleSubmit} title="Agregar" />
                                ))}
                            </View>
                        </View>

                    )}


                </Formik>

                <View>
                    {data.map((item,i) => {
                        return(
                        <ListItem.Swipeable
                            key={i + '-LIST'}
                            style={{borderWidth:3, borderColor:'#E1E1E1', margin:5, borderRadius:5}}
                            rightContent={(reset) => (
                                <Button
                                    title="Borrar"
                                    onPress={() => {
                                        data.splice(i,1);
                                        setData([...data]);
                                    }}
                                    icon={{ name: 'delete', color: 'white' }}
                                    buttonStyle={{ minHeight: '85%', backgroundColor: 'red', margin:5 }}
                                />
                            )}
                            onPress={() => editarItem(item,i)}
                        >
                            <ListItem.Content>
                            {labelsArry.map((label,x) => {
                                return(
                                <ListItem.Title key={label+x+i}>
                                    <Text style={{fontWeight:900}}>{labels[label]}: </Text> {item[label]} 
                                </ListItem.Title>
                                )
                            })}
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem.Swipeable>

                        )
                    })}
                </View>



            </ScrollView>

                <Modal
                style={{width:'100%',height:'100%'}}
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                >
                    <View>
                        <ButtonGroup
                            buttons={['Salir']}
                            selectedIndex={null}
                            buttonStyle={{backgroundColor:'#E1E1E1'}}
                            buttonContainerStyle={{borderColor:'gray'}}
                            onPress={(value) => {           
                                setModalVisible(false)
                            }}
                            containerStyle={{ marginBottom: 20 }}
                        />

                        {errores.map((item,i) => {
                                return(
                                    <ListItem style={{margin:10}} onPress={()=>OpenURLButton(item['FMPATHFOR'])}>
                                        <ListItem.Content>
                                        {labelsArryErr.map((label,x) => {
                                            return(
                                            <ListItem.Title key={label+x+i} onPress={()=> console.log('item')}>
                                                <Text style={{fontWeight:900}}>{labelsErr[label]}: </Text> {item[label]} 
                                            </ListItem.Title>
                                            )
                                        })}
                                        </ListItem.Content>
                                    </ListItem>

                                )
                        })}
                    </View>
            </Modal>
            <Modal
                animationType="slide"
                visible={modalVisible2}
                onRequestClose={() => {
                setModalVisible2(!modalVisible2);
            }}>
            <View style={styles.centeredView}>
            <Button
                title={'Cancelar'}
                    buttonStyle={{
                        borderColor: 'rgba(78, 116, 289, 1)',
                    }}
                    type='solid'
                    containerStyle={{
                        marginEnd:'auto',
                        marginStart:10,
                        width:150,
                        marginTop:20,
                        marginBottom:10
                    }}
                    onPress={() => setModalVisible2(!modalVisible2)}
                ></Button>
                <Card.Divider />
                        <View style={styles.modalView}>
                            <QuillComponent   setModalVisible={setModalVisible2} setTextBase64={setTextBase64} req={reqData} />                  
                        </View>
                    </View>
                </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    select: {
        borderBottomWidth:1,
        borderBottomColor:'gray',
        color:'black',
        margin:10,
        marginTop: 0
    },
    navBarLeftButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        flex: 1,
        paddingRight: '40px',
        textAlign: 'center',
    },
    headerTitulo:{
        textAlign: 'center',
        padding: 10,
        width:'100%',
      },
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
})



export default OrdenCompraComponent;