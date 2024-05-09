/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, Icon, Tab, Text, ListItem } from '@rneui/base';
import { Input } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { ScrollView, TextInput, ToastAndroid, View } from 'react-native';
import axios from 'axios';
import * as rqdata from './components/params_request';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';
import { ButtonGroup } from 'react-native-elements';



function App() {

  const ref = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [inputs, setInputs] = React.useState([]);
  const [dataInfo, setDataInfo] = React.useState([]);
  const [labels, setLabels] = React.useState(null);
  const [labelsArry, setLabelsArry] = React.useState(null);
  const [btnHeader, setBtnHeader] = React.useState([]);
  const [btnFooter, setBtnFooter] = React.useState([]);
  /* VARIABLES DEL DATEPICKER */
  const [datePk, setDatePk] = React.useState(new Date())
  const [openPk, setOpenPk] = React.useState(false)
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
    if(dataInfo.length == 0){
      data_list();
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
    var reponse = await axios.post(`${url_api}`,rqdata.init);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      setInputs(d.FProgramInquiry);
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

  const data_list = async () => {
    console.log('api');
    var reponse = await axios.post(`${url_api}`,rqdata.list_data);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      setDataInfo(d.FProgramInquiry);
    }
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

  const open_modal_info = async (value) => {
    console.log(value);
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
              />
            ))}

            {(item.UDUDC == "QR" && (
              <Input
                placeholder={item.UDDESCRIPCION} 
                rightIcon={{ type: 'ionicon', name: 'barcode-outline' }}
                maxLength={Number(item.UDLONGITUD)}
                onChangeText={value => this.setState({ comment: value })}
              />
  
            ))}
  
            {(item.UDUDC == "FYEAR_AEYEAR" && (
              <Picker>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker> 
  
            ))}

            {(item.UDUDC == "GRUPO" && (
              <Picker>
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
              </Picker> 
  
            ))}

            {(item.UDTIPO == "D" && (
              <Input 
                placeholder={item.UDDESCRIPCION} 
                maxLength={Number(item.UDLONGITUD)}
                onFocus={()=> setOpenPk(true)}
              />
            ))}

            {(item.UDTIPO == "T" && (
              <Input 
                placeholder={item.UDDESCRIPCION} 
                maxLength={Number(item.UDLONGITUD)}
                onFocus={()=> setOpenPk(true)}
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
        <ScrollView>
          {dataInfo.map((item,i) => {
            return(
              <ListItem.Swipeable
                onLongPress={()=> open_modal_info(item['LOITEM'])}
      
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
                      <ListItem.Title>{labels[label]}: {item[label]} </ListItem.Title>
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
    </View>
    </>
  );
};



export default App;
