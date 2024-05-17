
import { Input, Icon } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { Alert, Modal, StyleSheet, ToastAndroid, View } from 'react-native';
import axios from 'axios';
import * as rqdata from './params_request';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup, Dialog, Text } from 'react-native-elements';
import { Formik } from 'formik';
/* ---------------------------------- */
import QRComponent from './code'  ;
import { TextInput } from 'react-native';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';



const FormsComponents = (props) => {
  const ref = useRef();
  const formikRef = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [inputs, setInputs] = React.useState([]);
  const [inputsReq, setInputsReq] = React.useState([]);

  const [btnHeader, setBtnHeader] = React.useState([]);
  const [cat1, setCat1] = React.useState([]);
  const [cat2, setCat2] = React.useState([]);
  const [lote, setLote] = React.useState(props.data?props.data.lote:{});
  const [modalVisible, setModalVisible] = React.useState(false)
  const [code, setCode] = React.useState(false)
  const [labels, setLabels] = React.useState(null);
  const [labelsArry, setLabelsArry] = React.useState([]);
 
  /* variables de json error */
  const [visible, setVisible] = React.useState(false)
  const [errores, setErrors] = React.useState(false)
  /* variables del picker */
  const [datePk, setDatePk] = React.useState(new Date())
  const [openPk, setOpenPk] = React.useState(false)
  const [typePk, setTypePk] = React.useState('')
  const [valuePk, setValuePk] = React.useState('')
  /* VARIABLES BTN GROUPS */
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const _api_init = async () => {

    /* CARGAR LOS INPUTS */
    var reponse = await axios.post(`${url_api}`,rqdata.init);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      d.FProgramInquiry = d.FProgramInquiry.sort(function(a, b){
        if(a.SEQUENCIA < b.SEQUENCIA) { return -1; }
        if(a.SEQUENCIA > b.SEQUENCIA) { return 1; }
        return 0;
      });
      var inpts = d.FProgramInquiry
      setInputs(d.FProgramInquiry);

      var reqre = [];
      for (let i = 0; i < d.FProgramInquiry.length; i++) {
        const element = d.FProgramInquiry [i];
        if(element.REQUERIDO == 'R'){
          reqre.push(element.UDCAMPO);
        }
      }
      setInputsReq(reqre);
    
      labels_list()
      
        /* CARGAR LOS BOTONES */
        var reponse = await axios.post(`${url_api}`,rqdata.buttons_header_form);
        
        if(reponse.data.Json){
            let d = JSON.parse(reponse.data.Json);
            var data = [];
            var dta = d.FINQBARRAFIX;
            console.log(d);
            let icons = {'1':'done','2':'close','3':'search'}
            let iconsColor = {'1':'blue','2':'green','3':'red'}
            for (let i = 0; i < dta.length; i++) {
                const element = dta[i];
                console.log(element);
                data.push(<View style={styles.navBarLeftButton}><Icon name={icons[element.Id]} color={iconsColor[element.Id]} /><Text style={styles.buttonText}>{element.Titulo}</Text></View>)  
                
            }
            setBtnHeader(data)
        }
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

  const toggleDialog = () => {
    setVisible(!visible);
  };

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

  useEffect(() => {
    _api_init();

    return () => {
      setLote(lote);
    }
  }, [])


  const actions = async (value) => {
    switch (value) {
        case 0:
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
                let body = rqdata.guardar;
                let json = JSON.parse(body.json);
                if(props.data){
                    const regex = /[:,/]/gm;
                    let dta = lote.LODATRECEIP.replace(regex,'');
                    json.Parameter = 'U|0|' + lote.LOITEM+'|'+lote.LOBARCODE+'|'+lote.LOCAT1+'|'+lote.LOCAT2+'|'+dta+'|'+lote.LOTIMEREC+'|'
                    body.json = JSON.stringify(json);
                    let guardar = await axios.post(`${url_api}`,body);
                    if(guardar.data.Json === 'OK'){
                        ToastAndroid.show('Actualizado correctamente', ToastAndroid.LONG);
                        props.setModalVisible(false);
                    }else{
                        setErrors(JSON.stringify(guardar.data.Json))
                    }
                }else{
                    const regex = /[:,/]/gm;
                    let dta = lote.LODATRECEIP.replace(regex,'');
                    var lte = formikRef.current.values;
                    json.Parameter = 'A|0|' + lte.LOITEM+'|'+lte.LOBARCODE+'|'+lte.LOCAT1+'|'+lte.LOCAT2+'|'+dta+'|'+lte.LOTIMEREC+'|'
                    body.json = JSON.stringify(json);
                    let guardar = await axios.post(`${url_api}`,body);
                    if(guardar.data.Json === 'OK'){
                        ToastAndroid.show('Item Guardado correctamente', ToastAndroid.LONG);
                        setLote({});
                        formikRef.current.values = {}
                        formikRef.current.values = {}
                        formikRef.current.resetForm({})
                        formikRef.current.resetForm({})
                    }else{
                        setErrors(JSON.stringify(guardar.data.Json))
                    }
                }
            }else{
                ToastAndroid.show((lbls.toUpperCase())+' no pueden ir vacíos', ToastAndroid.LONG);
            }

            /* pendeinte de guardar */

            break;
        case 1:
            props.setModalVisible(false);
            break;
        case 2:
            setVisible(true);
            break;
        default:
            break;
    }
  }

  const openPicker = (campo,tipo) => {
    setTypePk(tipo)
    if(tipo == 'time'){
        setValuePk('LOTIMEREC')
    }else{
        setValuePk('LODATRECEIP')
    }
    setOpenPk(true);
  }

  const getValue = (UDTIPO,value)=>{
    lote[UDTIPO] = value;
    setLote(lote);
  }

 

  return (
    <>
    <View style={{height:'100%', overflow:'scroll'}}>

      <ButtonGroup
        buttons={btnHeader}
        selectedIndex={selectedIndex}
        buttonStyle={{backgroundColor:'#E1E1E1'}}
        buttonContainerStyle={{borderColor:'gray'}}
        onPress={(value) => {
          actions(value);
        }}
        containerStyle={{ marginBottom: 20 }}
      />

        <Formik
            initialValues={lote}
            innerRef={formikRef}
            onSubmit={values => console.log(values)}
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
        <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalVisible}
        >
            <View>
              <View>
                <QRComponent setModalVisible={setModalVisible} lote={lote} setLote={setLote} form={formikRef} />                
              </View>
            </View>
          </Modal>

        <Dialog
            isVisible={visible}
            onBackdropPress={toggleDialog}
            >
            <Dialog.Title title="Dialog Title"/>
            <Text>{ errores }</Text>
        </Dialog>


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

export default FormsComponents;
