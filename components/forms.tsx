
import { Input } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import axios from 'axios';
import * as rqdata from './params_request';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup } from 'react-native-elements';



const FormsComponents = (props) => {

  const ref = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [inputs, setInputs] = React.useState([]);
  const [lote, setLote] = React.useState(null);
  const [btnHeader, setBtnHeader] = React.useState([]);
  const [datePk, setDatePk] = React.useState(new Date())
  const [openPk, setOpenPk] = React.useState(false)
  /* VARIABLES BTN GROUPS */
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  useEffect(() => {
    if(inputs.length == 0){
      _api_init();
      console.log(props);
    }
    if(btnHeader.length == 0){
      btn_list();
    }
    if(!lote){
        load_data();
      }
  });


  const _api_init = async () => {
    console.log('api');
    var reponse = await axios.post(`${url_api}`,rqdata.init);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      setInputs(d.FProgramInquiry);
      console.log(d);
    }
  }

  const load_data = async () => {
    console.log('apixxx');
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
        setLote(model);
    }
  }

  const btn_list = async () => {
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
  
  return (
    <>
    <View style={{height:'100%', overflow:'scroll'}}>

      <ButtonGroup
        buttons={btnHeader}
        selectedIndex={selectedIndex}
        onPress={(value) => {
          setSelectedIndex(value);
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
              />
            ))}

            {(item.UDUDC == "QR" && (
              <Input
                placeholder={item.UDDESCRIPCION} 
                rightIcon={{ type: 'ionicon', name: 'barcode-outline' }}
                maxLength={Number(item.UDLONGITUD)}
                onChangeText={value => this.setState({ comment: value })}
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
                onFocus={()=> setOpenPk(true)}
                value={item.UDCAMPO?lote[item.UDCAMPO]:''}
              />
            ))}

            {(item.UDTIPO == "T" && (
              <Input 
                placeholder={item.UDDESCRIPCION} 
                maxLength={Number(item.UDLONGITUD)}
                onFocus={()=> setOpenPk(true)}
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
            onConfirm={(date) => {
              setOpenPk(false)
              setDatePk(date)
            }}
            onCancel={() => {
              setOpenPk(false)
            }}
          />
        </View>
    </View>
    </>
  );
};



export default FormsComponents;
