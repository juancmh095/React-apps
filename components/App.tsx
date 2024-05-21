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
import * as rqdata from './params_request';
//import DatePicker from 'react-native-date-picker'
import { TimeDatePicker, Modes } from "react-native-time-date-picker";
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup, CheckBox } from 'react-native-elements';
import FormsComponents  from './forms.tsx';
import { Formik } from 'formik';

import QRComponent from './code.tsx' ;
import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


function HomeComponent(props) {

  const formikRef = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [inputs, setInputs] = React.useState([]);
  const [titulo, setTitulo] = React.useState('Maestro de Lotes');
  const [checked, setChecked] = React.useState(null);
  const [dataInfo, setDataInfo] = React.useState([]);
  const [labels, setLabels] = React.useState(null);
  const [labelsArry, setLabelsArry] = React.useState([]);
  const [tiposSelectsArry, setTiposSelectArry] = React.useState([]);
  const [inputsReq, setInputsReq] = React.useState([]);
  const [dataSelect, setDataSelect] = React.useState(null);
  const [dataSelects, setDataSelects] = React.useState(props.data.cat);
  const [cat1, setCat1] = React.useState([]);
  const [cat2, setCat2] = React.useState([]);
  const [btnHeader, setBtnHeader] = React.useState([]);
  const [btnFooter, setBtnFooter] = React.useState([]);
  const [btnFooterData, setBtnFooterData] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [modalVisible3, setModalVisible3] = React.useState(false);
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

    var inp_header;
    if(props){
      console.log('props',props);
      setTitulo(props.data.titulo);
      if(props.data.program == 'PREPORTS'){
        inp_header = rqdata.inputs_preport;
      }
    }

    
    var reponse = await axios.post(`${url_api}`,inp_header);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      setInputs(d.FProgramInquiry);
      var reqre = [];
      console.log(d);  
      d.FProgramInquiry = d.FProgramInquiry.sort(function(a, b){
        if(a.SEQUENCIA < b.SEQUENCIA) { return -1; }
        if(a.SEQUENCIA > b.SEQUENCIA) { return 1; }
        return 0;
      });
      for (let i = 0; i < d.FProgramInquiry.length; i++) {
        const element = d.FProgramInquiry [i];
        formikRef.current.values[element.UDCAMPO] = element.VALOR;
        if(element.REQUERIDO == 'R'){
          reqre.push(element.UDCAMPO);
        }
      }
      setInputsReq(reqre);
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

  const changeDateTime = (setFieldValue,campo, value, event) => {
    if(event.type == 'set'){
      if(campo == 'LODATRECEIP'){
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

  const btn_list = async () => {
    var reponse = await axios.post(`${url_api}`,rqdata.buttons);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      var data = [];
      var dta = d.FINQBARRA;
      let icons = {1:'check',2:'search',3:'add',4:'close'}
      let iconsColor = {1:'green',2:'blue',3:'green',4:'red'}
      for (let i = 0; i < dta.length; i++) {
        const element = dta[i];
        data.push(<View style={styles.navBarLeftButton}><Icon name={icons[element.Id]} color={iconsColor[element.Id]} /><Text style={styles.buttonText}>{element.Titulo}</Text></View>)        
      }
      setBtnHeader(data)
    }
  }

  const btn_footer = async () => {
    var bHeader = rqdata.buttons_footer;
    if(props){
      if(props.data.program == 'PREPORTS'){
        bHeader = rqdata.btn_preport_header;
      }
    }

    var reponse = await axios.post(`${url_api}`,bHeader);
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      var data = [];
      var dta = d.FBARRAPROGRAM;
      setBtnFooterData(dta);
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

  const openFooterAction = (value) => {
    let params = btnFooterData[value].PARAMS;
    let titul = btnFooterData[value].NOMBREPGM;
    let data = dataInfo[checked];
    params = params.split('|');

    let model = {};

    params.forEach(element => {
      model[element] = data[element]
    });

    console.log(model);
  }

  





  
  return (
    <>
    <View style={{height:'100%', overflow:'scroll', backgroundColor:'white'}}>
      
      <View style={styles.headerTitulo}>
        <Text style={{textAlign:'center', fontSize:20}}>{titulo}</Text>
      </View>
      <ButtonGroup
        buttons={btnHeader}
        selectedIndex={selectedIndex}
        buttonStyle={{backgroundColor:'#E1E1E1'}}
        buttonContainerStyle={{borderColor:'gray'}}
        onPress={(value) => {
          if(value == 2){
            setDataSelect(null)
            setModalVisible(true);
          }
          if(value == 3){
            props.setModalVisible3(false)
            
          }
          if(value == 1){
            buscarItem();
          }

          if(value == 0){
            openAction(dataInfo[checked]['LOITEM'],0)
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
                        if(item.UDTIPO == "" && item.UDTIPO != "T" && item.UDTIPO != "D"){
                            return(
                                <Input 
                                    autoCapitalize={ (item.UPPERCASE == 'U')?"characters":"none"}
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
                                        rightIcon={{ type: 'ionicon', name: 'barcode-outline', size:40 }}
                                        maxLength={Number(item.UDLONGITUD)}
                                        onFocus={()=> setModalVisible2(true)}
                                        value={values[item.UDCAMPO]}
                                        onChangeText={handleChange(item.UDCAMPO)}
                                    />
                                )
                            }else{
                                if(item.UDTIPO == "S"){
                                    return(
                                        <View style={styles.select}>
                                            <Picker
                                                style={{color:'black'}}
                                                selectedValue={values[item.UDCAMPO]}
                                                style={styles.formControlSelect}
                                                onValueChange={handleChange(item.UDCAMPO)}
                                            >
                                                <Picker.Item label={item.UDDESCRIPCION} value='' />
                                                {dataSelects[item.UDUDC].map((item) => {
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
                                                    onFocus={()=> DateTimePickerAndroid.open({mode:'date', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(setFieldValue,item.UDCAMPO,value,event)} })}
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
                                                        onFocus={()=> DateTimePickerAndroid.open({mode:'time', value:datePk, is24Hour:true, onChange:(event,value)=>{changeDateTime(setFieldValue,item.UDCAMPO,value,event)} })}
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
              
                  <CheckBox
                    checked={checked === i}
                    onPress={() => setChecked(i)}
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
                <ListItem.Chevron />
              </ListItem.Swipeable>

            )
          })}

        </ScrollView>
          <ButtonGroup
            buttons={btnFooter}
            selectedIndex={selectedIndexf}
            onPress={(value) => {
              openFooterAction(value);
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

export default HomeComponent;
