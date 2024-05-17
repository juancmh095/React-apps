/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, Icon, Tab, Text, ListItem } from '@rneui/base';
import { Input,  Header } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { Alert, BackHandler, Modal, Pressable, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import axios from 'axios';
import * as rqdata from './components/params_request';
//import DatePicker from 'react-native-date-picker'
import { TimeDatePicker, Modes } from "react-native-time-date-picker";
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup } from 'react-native-elements';
import FormsComponents  from './components/forms.tsx';
import { Formik } from 'formik';

import QRComponent from './components/code.tsx' ;
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


function App() {

  const formikRef = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [inputs, setInputs] = React.useState([]);
  const [dataInfo, setDataInfo] = React.useState([]);
  const [labels, setLabels] = React.useState(null);
  const [labelsArry, setLabelsArry] = React.useState([]);
  const [inputsReq, setInputsReq] = React.useState([]);
  const [dataSelect, setDataSelect] = React.useState(null);
  const [cat1, setCat1] = React.useState([]);
  const [cat2, setCat2] = React.useState([]);
  const [btnHeader, setBtnHeader] = React.useState([]);
  const [btnFooter, setBtnFooter] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [lote, setLote] = React.useState({})
   /* variables del picker */
   const [datePk, setDatePk] = React.useState(new Date())
   const [openPk, setOpenPk] = React.useState(false)
   const [typePk, setTypePk] = React.useState('')
   const [valuePk, setValuePk] = React.useState('')
  /* VARIABLES BTN GROUPS */
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [selectedIndexf, setSelectedIndexf] = React.useState(null);

  useEffect(() => {
    if(inputs.length == 0){
      _api_init();
    }
    if(!labels){
      labels_list();
    }
    if(btnHeader.length == 0){
      btn_list();
    }
    if(btnFooter.length == 0){
      btn_footer();
    }
  });


  const _api_init = async () => {
    var reponse = await axios.post(`${url_api}`,rqdata.btn_buscar);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      setInputs(d.FProgramInquiry);
      var reqre = [];
      
      d.FProgramInquiry = d.FProgramInquiry.sort(function(a, b){
        if(a.SEQUENCIA < b.SEQUENCIA) { return -1; }
        if(a.SEQUENCIA > b.SEQUENCIA) { return 1; }
        return 0;
      });
      console.log(d);
      for (let i = 0; i < d.FProgramInquiry.length; i++) {
        const element = d.FProgramInquiry [i];
        if(element.REQUERIDO == 'R'){
          reqre.push(element.UDCAMPO);
        }
      }
      setInputsReq(reqre);
    }

    /* CARGA LA DATA DE LOS SELECTS 1 */
    var catR1 = await axios.post(`${url_api}`,rqdata.categoria1);
        
    if(catR1.data.Json){
        let d = JSON.parse(catR1.data.Json);
        setCat1(d.FPGMINQUIRY);
    }
     /* CARGA LA DATA DE LOS SELECTS 2 */
     var catR2 = await axios.post(`${url_api}`,rqdata.categoria2);
        
     if(catR2.data.Json){
         let d = JSON.parse(catR2.data.Json);
         setCat2(d.FPGMINQUIRY);
     }
  }
  const labels_list = async () => {
    var reponse = await axios.post(`${url_api}`,rqdata.labels);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
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
      setLabels(lbs);
      setLabelsArry(dArr);
    }
  }

  const changeDateTime = (setFieldValue,campo, value) => {
    if(campo == 'LODATRECEIP'){
      let dt = new Date(value);
      console.log('x',dt.toLocaleDateString('es-MX').split(' '));
      dt = dt.toLocaleDateString('es-MX').split('/');
      dt = (Number(dt[0])<9?('0'+dt[0]):dt[0]) + '/' + (Number(dt[1])<9?('0'+dt[1]):dt[1]) + '/' + (Number(dt[2])<9?('0'+dt[2]):dt[2]);
      setFieldValue(campo,dt);
    }else{
      let dt = new Date(value);
      let hora = dt.toLocaleTimeString('es-MX').split(' ')[0];
      setFieldValue(campo,hora);
    }
  }

  const btn_list = async () => {
    var reponse = await axios.post(`${url_api}`,rqdata.buttons);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      var data = [];
      var dta = d.FINQBARRA;
      let icons = {1:'search',2:'add',3:'close'}
      let iconsColor = {1:'blue',2:'green',3:'red'}
      for (let i = 0; i < dta.length; i++) {
        const element = dta[i];
        data.push(<View style={styles.navBarLeftButton}><Icon name={icons[element.Id]} color={iconsColor[element.Id]} /><Text style={styles.buttonText}>{element.Titulo}</Text></View>)        
      }
      setBtnHeader(data)
    }
  }

  const btn_footer = async () => {
    var reponse = await axios.post(`${url_api}`,rqdata.buttons_footer);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      var data = [];
      var dta = d.FBARRAPROGRAM;
      for (let i = 0; i < dta.length; i++) {
        const element = dta[i];
        let icons = {PITEM:'playlist-add',PBRANCH:'business',PREPORTS:'filter-alt'}
        
        data.push(<View style={styles.navBarLeftButton}><Icon name={icons[element.OPOBNMOPC]} color='green' /><Text style={styles.buttonText}>{element.OPTITULO}</Text></View>) 

      }
      setBtnFooter(data)
    }
  }

  const deleteItem = async (value) => {
    Alert.alert('Borrar Item','¿Está seguro de querer borrar el ítem seleccionado?', [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {text: 'Aceptar', onPress: async () => {
          let body = rqdata.delete;
          let json = JSON.parse(body.json);
          let row = json.Rows;
          let r = "D|0|"+value+"|";
          row[0]['Data'] = r;
          json.Rows = row;
          body.json = JSON.stringify(json);
          let response = await axios.post(`${url_api}`,body);
          if(response.data.Json == ""){
            buscarItem();
          }
        }},
    ]);
  }

  const closeApp = async () => {
    Alert.alert('Salir','¿Está seguro de querer salir de la aplicación?', [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {text: 'Aceptar', onPress: () => BackHandler.exitApp()},
    ]);
  }
  

  const openAction = async (value, action) => {
     switch(action){
        case 0:
            var req = rqdata.get_data;
            req.json = JSON.parse(req.json);
            req.json.Rows[0].Data = "0|PLOTE|U|F|@0@"+value+"|";
            req.json = JSON.stringify(req.json);
            axios.post(`${url_api}`,req).then((reponse) => {
              
              let d = JSON.parse(reponse.data.Json);
              var loteModel = d.FProgramInquiry[0];
              setDataSelect({lote: loteModel, tipo:'U'})
              setModalVisible(true);
            });
            
            break;
        case 2:
          setDataSelect({lote: {}, tipo:'A'});
          setModalVisible(true);
          break;
     }
  }

  const buscarItem = async () => {
    var lte = formikRef.current.values;
    var validate = false;
    var count = 0;
    var lbls = ""
    for (let x = 0; x < inputsReq.length; x++) {
      const element = inputsReq[x];
      if(lte[element] && lte[element] != ""){
          count = count + 1;
      }else{
        lbls = lbls +","+ labels[element];
      }
    }

    if(count == inputsReq.length){
      validate = true;
    }
    
    if(validate){
      let body = rqdata.buscar;
      let json = JSON.parse(body.json);
      let row = json.Rows;
      let r = "0|PLOTE|F|B|@0@" + (lte.LOITEM?lte.LOITEM:"") +'@'+(lte.LOBARCODE?lte.LOBARCODE:"")+'@'+(lte.LOCAT1?lte.LOCAT1:"")+'@'+(lte.LOCAT2?lte.LOCAT2:"")+'@'+(lte.LODATRECEIP?lte.LODATRECEIP:"")+'@'+(lte.LOTIMEREC?lte.LOTIMEREC:"")+'@@|';
      row[0]['Data'] = r;
      json.Rows = row;
      body.json = JSON.stringify(json);
      let response = await axios.post(`${url_api}`,body);
      if(response.data.Json != ""){
        var dat = JSON.parse(response.data.Json);
        dat = dat.FProgramInquiry;
        if(dat.length > 0){
          setDataInfo(dat);
        }
        
      }else{
        setDataInfo([]);
      }
    }else{
      ToastAndroid.show((lbls.toUpperCase())+' no pueden ir vacíos', ToastAndroid.LONG);
    }
  }

  





  
  return (
    <>
    <View style={{height:'100%', overflow:'scroll', backgroundColor:'white'}}>
      
      <View style={styles.headerTitulo}>
        <Text style={{textAlign:'center', fontSize:20}}>Maestro de Lotes</Text>
      </View>
      <ButtonGroup
        buttons={btnHeader}
        selectedIndex={selectedIndex}
        buttonStyle={{backgroundColor:'#E1E1E1'}}
        buttonContainerStyle={{borderColor:'gray'}}
        onPress={(value) => {
          if(value == 1){
            setDataSelect(null)
            setModalVisible(true);
          }
          if(value == 2){
            closeApp()
            
          }
          if(value == 0){
            buscarItem();
          }
          
        }}
        containerStyle={{ marginBottom: 20 }}
      />

        <Formik
            initialValues={{}}
            key={'form1'}
            onSubmit={values => console.log(values)}
            innerRef={formikRef}
            
        >
            {({ handleChange, setFieldValue, handleSubmit, values }) => (
                
                <View>
                    {inputs.map((item,i)=>{
                        if(item.UDUDC == "" && item.UDTIPO != "T" && item.UDTIPO != "D"){
                            return(
                                <Input 
                                    placeholder={item.UDDESCRIPCION} 
                                    maxLength={Number(item.UDLONGITUD)}
                                    value={values[item.UDCAMPO]}
                                    style={styles.formControl}
                                    containerStyle={{margin:0, padding:0, height:50}}
                                    inputContainerStyle={{borderBottomWidth:0}}
                                    onChangeText={handleChange(item.UDCAMPO)}
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
                                        rightIcon={{ type: 'ionicon', name: 'barcode-outline' }}
                                        maxLength={Number(item.UDLONGITUD)}
                                        onFocus={()=> setModalVisible(true)}
                                        value={values[item.UDCAMPO]}
                                        onChangeText={handleChange(item.UDCAMPO)}
                                    />
                                )
                            }else{
                                if(item.UDUDC == "FYEAR_AEYEAR"){
                                    return(
                                        <View style={styles.select}>
                                            <Picker
                                                style={{color:'black'}}
                                                selectedValue={values[item.UDCAMPO]}
                                                style={styles.formControlSelect}
                                                onValueChange={handleChange(item.UDCAMPO)}
                                            >
                                                <Picker.Item label='Categoria 1' value='' />
                                                {cat1.map((item) => {
                                                    return(
                                                        <Picker.Item label={item.Valor} value={item.Valor} />
                                                    )
                                                })}
                                            </Picker> 
                                        </View>
                                    )
                                }else{
                                    if(item.UDUDC == "GRUPO"){
                                        return(
                                            <View style={styles.select}>
                                                <Picker
                                                    style={{color:'black'}}
                                                    selectedValue={values[item.UDCAMPO]}
                                                    style={styles.formControlSelect}
                                                    onValueChange={handleChange(item.UDCAMPO)}
                                                >
                                                    <Picker.Item label='Categoria 2' value='' />
                                                    {cat2.map((item) => {
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
                                                    onFocus={()=> DateTimePickerAndroid.open({mode:'date', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(setFieldValue,item.UDCAMPO,value)} })}
                                                    onChangeText={handleChange(item.UDCAMPO)}
                                                    value={values[item.UDCAMPO]}
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
                                                        onFocus={()=> DateTimePickerAndroid.open({mode:'time', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(setFieldValue,item.UDCAMPO,value)} })}
                                                        onChangeText={handleChange(item.UDCAMPO)}
                                                        value={values[item.UDCAMPO]}
                                                    /> 
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })}
                    
                    <View>
                    </View>
                </View>
                    
                
            )}

        </Formik>
        <ScrollView>
          {dataInfo.map((item,i) => {
            return(
              <ListItem.Swipeable
                key={i + '-LIST'}
                onLongPress={()=> openAction(item['LOITEM'],0)}
                onPress={() => openAction(item['LOITEM'],0)}
                style={{borderWidth:3, borderColor:'#E1E1E1', margin:5, borderRadius:5}}
                rightContent={(reset) => (
                  <Button
                    title="Borrar"
                    onPress={() => deleteItem(item['LOITEM'])}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '85%', backgroundColor: 'red', margin:5 }}
                  />
                )}
              >
              
                <ListItem.Content>
                  {labelsArry.map((label,x) => {
                    return(
                      <ListItem.Title key={label+x+i}>{labels[label]}: {item[label]} </ListItem.Title>
                    )
                  })}
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem.Swipeable>

            )
          })}

        </ScrollView>
          <ButtonGroup
            buttons={btnFooter}
            selectedIndex={selectedIndexf}
            onPress={(value) => {
              setSelectedIndexf(value);
            }}
            containerStyle={{ marginBottom: 0, position:''}}
          />

        <View>
          <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            >
            <View>
              <View>
                <FormsComponents setModalVisible={setModalVisible} data={dataSelect} />                
              </View>
            </View>
          </Modal>

          <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalVisible2}
          >
            <View>
              <View>
                <QRComponent setModalVisible={setModalVisible2} lote={lote} setLote={setLote} form={formikRef} />                
              </View>
            </View>
          </Modal>
        </View>
    </View>
    </>
  );
};

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

export default App;
