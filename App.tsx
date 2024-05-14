/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, Icon, Tab, Text, ListItem } from '@rneui/base';
import { Input } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { Alert, BackHandler, Modal, Pressable, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import axios from 'axios';
import * as rqdata from './components/params_request';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup } from 'react-native-elements';
import FormsComponents  from './components/forms.tsx';
import { Formik } from 'formik';

import QRComponent from './components/code.tsx' ;


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
    console.log('api');
    var reponse = await axios.post(`${url_api}`,rqdata.btn_buscar);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      setInputs(d.FProgramInquiry);
      var reqre = [];
      for (let i = 0; i < d.FProgramInquiry.length; i++) {
        const element = d.FProgramInquiry [i];
        console.log(element, element.REQUERIDO);
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
         console.log('gruppo',d);
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


  const openPicker = (campo,tipo) => {
    setTypePk(tipo)
    console.log(campo);
    if(tipo == 'time'){
        setValuePk('LOTIMEREC')
    }else{
        setValuePk('LODATRECEIP')
    }
    setOpenPk(true);
  }

  const btn_list = async () => {
    console.log('api');
    var reponse = await axios.post(`${url_api}`,rqdata.buttons);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      var data = [];
      var dta = d.FINQBARRA;
      for (let i = 0; i < dta.length; i++) {
        const element = dta[i];
        data.push(element.Titulo)
        
      }
      setBtnHeader(data)
    }
  }

  const btn_footer = async () => {
    console.log('api');
    var reponse = await axios.post(`${url_api}`,rqdata.buttons_footer);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      var data = [];
      var dta = d.FBARRAPROGRAM;
      for (let i = 0; i < dta.length; i++) {
        const element = dta[i];
        data.push(element.OPTITULO)
        
      }
      console.log(data);
      setBtnFooter(data)
    }
  }

  const deleteItem = async () => {
    Alert.alert('Borrar Item','¿Está seguro de querer borrar el ítem seleccionado?', [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {text: 'Aceptar', onPress: () => console.log('OK Pressed')},
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
  

  const openAction = async (value) => {
    console.log('v',value,selectedIndex);
     switch(selectedIndex){
        case 0:
            console.log('seleccionar',value)
            var req = rqdata.get_data;
            req.json = JSON.parse(req.json);
            req.json.Rows[0].Data = "0|PLOTE|U|F|@0@"+value+"|";
            req.json = JSON.stringify(req.json);
            axios.post(`${url_api}`,req).then((reponse) => {
              
              let d = JSON.parse(reponse.data.Json);
              var loteModel = d.FProgramInquiry[0];
              let ndate = (loteModel.LODATRECEIP).split('/');
              ndate = new Date(Number(ndate[2]),(Number(ndate[1])-1),Number(ndate[0])).toISOString();
              console.log(ndate);
              ndate = ndate.split('T')[0];
              const regex = /[:,-]/gm;
              ndate = ndate.replace(regex,'');
              loteModel.LODATRECEIP = ndate;
              console.log('lotemodel',loteModel);
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
    console.log(labels,inputsReq);
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
      console.log('Buscar');
      let body = rqdata.buscar;
      let json = JSON.parse(body.json);
      let row = json.Rows;
      let r = "0|PLOTE|F|B|@0@" + (lte.LOITEM?lte.LOITEM:"") +'@'+(lte.LOBARCODE?lte.LOBARCODE:"")+'@'+(lte.LOCAT1?lte.LOCAT1:"")+'@'+(lte.LOCAT2?lte.LOCAT2:"")+'@'+(lte.LODATRECEIP?lte.LODATRECEIP:"")+'@'+(lte.LOTIMEREC?lte.LOTIMEREC:"")+'@@|';
      row[0]['Data'] = r;
      console.log(r,lte)
      json.Rows = row;
      body.json = JSON.stringify(json);
      console.log(body);
      let response = await axios.post(`${url_api}`,body);
      console.log("x",response.data);
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
    <View style={{height:'100%', overflow:'scroll'}}>

      <ButtonGroup
        buttons={btnHeader}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
          if(value == 2){
            setDataSelect(null)
            setModalVisible(true);
          }
          if(value == 4){
            closeApp()
            
          }
          if(value == 1){
            buscarItem();
          }

          if(value == 3){
            deleteItem();
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
                        
                        return(
                            (item.UDUDC == "" && item.UDTIPO != "T" && item.UDTIPO != "D"  && (
                                <Input 
                                    key={item.UDCAMPO}
                                    placeholder={item.UDDESCRIPCION} 
                                    maxLength={Number(item.UDLONGITUD)}
                                    value={values[item.UDCAMPO]}
                                    defaultValue={values[item.UDCAMPO]}
                                    onChangeText={handleChange(item.UDCAMPO)}
                                    onEndEditing={()=> {
                                        lote[item.UDCAMPO] = values[item.UDCAMPO];
                                        setLote(lote)
                                    }}
                                />
                            ))                            
                        )
                    })}
                    {inputs.map((item,i)=>{
                        return(
                            (item.UDUDC == "QR" && (
                                <Input
                                    key={item.UDCAMPO}
                                    placeholder={item.UDDESCRIPCION} 
                                    rightIcon={{ type: 'ionicon', name: 'barcode-outline' }}
                                    maxLength={Number(item.UDLONGITUD)}
                                    onFocus={()=> setModalVisible2(true)}
                                    value={values[item.UDCAMPO]}
                                    onChangeText={handleChange(item.UDCAMPO)}
                                    onEndEditing={()=> setLote(values)}
                                />
                    
                            ))                           
                        )
                    })}

                    {inputs.map((item,i)=>{
                        return(
                            (item.UDUDC == "FYEAR_AEYEAR" && (
                                <View style={styles.select}>
                                    <Picker
                                        style={{color:'black'}}
                                        selectedValue={values[item.UDCAMPO]}
                                        onValueChange={handleChange(item.UDCAMPO)}
                                        key={item.UDCAMPO}
                                    >
                                        <Picker.Item label='Categoria 1' value='' />
                                        {cat1.map((item) => {
                                            return(
                                                <Picker.Item key={item.Valor} label={item.Valor} value={item.Valor} />
                                            )
                                        })}
                                    </Picker> 
                                </View>
                
                            ))                       
                        )
                    })}
                    {inputs.map((item,i)=>{
                        return(
                            (item.UDUDC == "GRUPO" && (
                                <View style={styles.select}>
                                    <Picker
                                        key={item.UDCAMPO}
                                        style={{color:'black'}}
                                        selectedValue={values[item.UDCAMPO]}
                                        onValueChange={handleChange(item.UDCAMPO)}
                                    >
                                        <Picker.Item label='Categoria 2' value='' />
                                        {cat2.map((item) => {
                                            return(
                                                <Picker.Item key={item.Valor} label={item.Valor} value={item.Valor} />
                                            )
                                        })}
                                    </Picker> 
                                </View>
                
                            ))                       
                        )
                    })}
                    {inputs.map((item,i)=>{
                        return(
                            (item.UDTIPO == "D" && (
                                <Input 
                                    key={item.UDCAMPO}
                                    placeholder={item.UDDESCRIPCION} 
                                    maxLength={Number(item.UDLONGITUD)}
                                    onFocus={()=> openPicker(item.UDCAMPO,'date')}
                                    onChangeText={handleChange(item.UDCAMPO)}
                                    value={values[item.UDCAMPO]}
                                />
                            ))                       
                        )
                    })}
                    {inputs.map((item,i)=>{
                        return(
                            (item.UDTIPO == "T" && (
                                <Input 
                                    key={item.UDCAMPO}
                                    placeholder={item.UDDESCRIPCION} 
                                    maxLength={Number(item.UDLONGITUD)}
                                    onFocus={()=> openPicker(item.UDCAMPO,'time')}
                                    onChangeText={handleChange(item.UDCAMPO)}
                                    value={values[item.UDCAMPO]}
                                />
                            ))                       
                        )
                    })}
                    
                    <View>
                        <DatePicker
                            modal
                            open={openPk}
                            date={datePk}
                            mode={typePk}
                            onConfirm={(date) => {
                                setOpenPk(false)
                                const regex = /[:,-]/gm;
                                date = date.toISOString();
                                var d = date.split('T')

                                if(typePk == 'time'){
                                    d = d[1].split('.');
                                    console.log(d);
                                    d = d[0].replace(regex,'');
                                }else{
                                    d = d[0].replace(regex,'')
                                }
                                setFieldValue(valuePk,d)
                                lote[valuePk] = d;
                                setLote(lote)
                            }}
                            onCancel={() => {
                              setOpenPk(false)
                            }}
                        />
                    </View>
                </View>
                    
                
            )}

        </Formik>
        <ScrollView>
          {dataInfo.map((item,i) => {
            return(
              <ListItem.Swipeable
                key={i + '-LIST'}
                onLongPress={()=> open_modal_info(item['LOITEM'])}
                onPress={() => openAction(item['LOITEM'])}
                rightContent={(reset) => (
                  <Button
                    title="Delete"
                    onPress={() => reset()}
                    icon={{ name: 'delete', color: 'white' }}
                    buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
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
  }
})

export default App;
