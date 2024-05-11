
import { Input } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { Modal, View } from 'react-native';
import axios from 'axios';
import * as rqdata from './params_request';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup } from 'react-native-elements';
import QRComponent from './code';



const FormsComponents = (props) => {

  const ref = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [inputs, setInputs] = React.useState([]);
  const [lote, setLote] = React.useState({});
  const [btnHeader, setBtnHeader] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false)
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
      setInputs(d.FProgramInquiry);
      console.log(d);
     
      /* CARGAR LOS VALORES O JSON VACIO */
      if(props.data){
        var req = rqdata.get_data;
        req.json = JSON.parse(req.json);
        req.json.Rows[0].Data = "0|PLOTE|U|F|@0@"+props.data.id+"|";
        req.json = JSON.stringify(req.json);
        console.log(req);
        var reponse = await axios.post(`${url_api}`,req);
        if(reponse.data.Json){
          let d = JSON.parse(reponse.data.Json);
          setLote(d.FProgramInquiry[0]);
        }
        }else{
            let model = {};
            inputs.forEach((element) => {
                if(element.UDCAMPO){
                    model[element.UDCAMPO] = "";
                }
            });
            model['LOTIME'] = '';
            model['LODATR'] = '';
            setLote(model);
        }

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

  }


  useEffect(() => {
    _api_init();

    return () => {
      console.log('El componente se ha desmontado')
    }
  }, [])


  const actions = (value) => {
    console.log(value);
    switch (value) {
        case 0:
            console.log(lote);
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

      {inputs.map((item,i)=>{
        return(

          <View>
            {(item.UDUDC == "" && item.UDTIPO != "T" && item.UDTIPO != "D"  && (
              <Input 
                placeholder={item.UDDESCRIPCION} 
                maxLength={Number(item.UDLONGITUD)}
                value={item.UDCAMPO?lote[item.UDCAMPO]:''}
                onChangeText={value =>{ 
                    lote[item.UDCAMPO] = value;
                    setLote(lote);
                }}
              />
            ))}

            {(item.UDUDC == "QR" && (
              <Input
                placeholder={item.UDDESCRIPCION} 
                rightIcon={{ type: 'ionicon', name: 'barcode-outline' }}
                maxLength={Number(item.UDLONGITUD)}
                onFocus={()=> setModalVisible(true)}
                onChangeText={value =>{ 
                    lote[item.UDCAMPO] = value;
                    setLote(lote);
                }}
                value={item.UDCAMPO?lote[item.UDCAMPO]:''}
              />
  
            ))}
  
            {(item.UDUDC == "FYEAR_AEYEAR" && (
              <Picker>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker> 
  
            ))}

            {(item.UDUDC == "GRUPO" && (
              <Picker selectedValue={item.UDCAMPO?lote[item.UDCAMPO]:''}>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker> 
  
            ))}

            {(item.UDTIPO == "D" && (
              <Input 
                placeholder={item.UDDESCRIPCION} 
                maxLength={Number(item.UDLONGITUD)}
                onFocus={()=> openPicker(item.UDCAMPO,'date')}
                value={item.UDCAMPO?lote[item.UDCAMPO]:''}
              />
            ))}

            {(item.UDTIPO == "T" && (
              <Input 
                placeholder={item.UDDESCRIPCION} 
                maxLength={Number(item.UDLONGITUD)}
                onFocus={()=> openPicker(item.UDCAMPO,'time')}
                value={item.UDCAMPO?lote[item.UDCAMPO]:''}
              />
            ))}
          </View>
          
          
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
                lote[valuePk] = d;
                setLote(lote)
            }}
            onCancel={() => {
              setOpenPk(false)
            }}
          />
        </View>

        <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View>
              <View>
                <QRComponent setModalVisible={setModalVisible} />                
              </View>
            </View>
          </Modal>
    </View>
    </>
  );
};



export default FormsComponents;
