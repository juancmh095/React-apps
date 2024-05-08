/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, Icon, Tab, Text, ListItem } from '@rneui/base';
import { Input } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { TextInput, ToastAndroid, View } from 'react-native';
import axios from 'axios';
import * as rqdata from './components/params_request';
import DatePicker from 'react-native-date-picker'
import { Picker } from '@react-native-picker/picker';



function App() {

  const ref = useRef();
  const url_api = "http://20.64.97.37/api/products";
  const [index, setIndex] = React.useState(0);
  const [inputs, setInputs] = React.useState([]);
  const [dataInfo, setDataInfo] = React.useState([]);
  const [labels, setLabels] = React.useState(null);
  const [labelsArry, setLabelsArry] = React.useState(null);
  const [datePk, setDatePk] = React.useState(new Date())
  const [openPk, setOpenPk] = React.useState(false)


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
      console.log(dArr);
    }
  }

  const data_list = async () => {
    console.log('api');
    var reponse = await axios.post(`${url_api}`,rqdata.list_data);
    
    if(reponse.data.Json){
      let d = JSON.parse(reponse.data.Json);
      setDataInfo(d.FProgramInquiry);
      console.log(d);
    }
  }





  
  return (
    <>
    <View>
     <Tab
      value={index}
      onChange={(e) => setIndex(e)}
      indicatorStyle={{
        backgroundColor: 'white',
        height: 3,
      }}
      variant="primary"
    >
      <Tab.Item
        title="Selec"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Buscar"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Agregar"
        titleStyle={{ fontSize: 7 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Borrar"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Salir"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
    </Tab>
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

        {dataInfo.map((item,i) => {
          return(
            <ListItem.Swipeable
              leftContent={(reset) => (
                <Button
                  title="Info"
                  onPress={() => reset()}
                  icon={{ name: 'info', color: 'white' }}
                  buttonStyle={{ minHeight: '100%' }}
                />
              )}
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
    </View>
    </>
  );
};



export default App;
