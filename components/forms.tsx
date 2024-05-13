
import { Input } from '@rneui/themed';
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



const FormsComponents = (props) => {
    console.log(props);
  const ref = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [inputs, setInputs] = React.useState([]);
  
  const [btnHeader, setBtnHeader] = React.useState([]);
  const [cat1, setCat1] = React.useState([]);
  const [cat2, setCat2] = React.useState([]);
  const [lote, setLote] = React.useState(props.data?props.data.lote:{});
  const [modalVisible, setModalVisible] = React.useState(false)
  const [code, setCode] = React.useState(false)
 
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
    console.log('api');
    var reponse = await axios.post(`${url_api}`,rqdata.init);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      var inpts = d.FProgramInquiry
      setInputs(d.FProgramInquiry);
      console.log(d);
     
      
        /* CARGAR LOS BOTONES */
        console.log('api');
        var reponse = await axios.post(`${url_api}`,rqdata.buttons_header_form);
        
        if(reponse.data.Json){
            let d = JSON.parse(reponse.data.Json);
            var data = [];
            var dta = d.FINQBARRAFIX;
            for (let i = 0; i < dta.length; i++) {
                const element = dta[i];
                data.push(element.Titulo)
                
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
         console.log('gruppo',d);
         setCat2(d.FPGMINQUIRY);
     }
  }

  const toggleDialog = () => {
    setVisible(!visible);
  };


  useEffect(() => {
    _api_init();

    return () => {
      console.log('El componente se ha desmontado')
      setLote(lote);
      console.log(lote);
    }
  }, [])


  const actions = async (value) => {
    console.log(value);
    switch (value) {
        case 0:
            console.log(lote);
            let body = rqdata.guardar;
            let json = JSON.parse(body.json);
            json.Parameter = lote.LOITEM+'|'+lote.LOBARCODE+'|'+lote.LOCAT1+'|'+lote.LOCAT2+'|'+lote.LODATRECEIP+'|'+lote.LOTIMEREC+'|'
            body.json = JSON.stringify(json);
            console.log(body);
            var guardar = await axios.post(`${url_api}`,body);
            console.log(guardar.data);
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
    console.log(campo);
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
        onPress={(value) => {
          actions(value);
        }}
        containerStyle={{ marginBottom: 20 }}
      />

        <Formik
            initialValues={lote}
            onSubmit={values => console.log(values)}
        >
            {({ handleChange, setFieldValue, handleSubmit, values }) => (
                
                <View>
                    {inputs.map((item,i)=>{
                        
                        return(
                            (item.UDUDC == "" && item.UDTIPO != "T" && item.UDTIPO != "D"  && (
                                <Input 
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
                                    placeholder={item.UDDESCRIPCION} 
                                    rightIcon={{ type: 'ionicon', name: 'barcode-outline' }}
                                    maxLength={Number(item.UDLONGITUD)}
                                    onFocus={()=> setModalVisible(true)}
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
                                    >
                                        <Picker.Item label='Categoria 1' value='' />
                                        {cat1.map((item) => {
                                            return(
                                                <Picker.Item label={item.Valor} value={item.Valor} />
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
                                        style={{color:'black'}}
                                        selectedValue={values[item.UDCAMPO]}
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
                
                            ))                       
                        )
                    })}
                    {inputs.map((item,i)=>{
                        return(
                            (item.UDTIPO == "D" && (
                                <Input 
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
        <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalVisible}
        >
            <View>
              <View>
                <QRComponent setModalVisible={setModalVisible} lote={lote} setLote={setLote} />                
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
    }
})

export default FormsComponents;
