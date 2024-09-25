import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { ButtonGroup, ListItem, Text } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from "../../services/Storage";

import * as rqdata from '../../components/tools/params_request';
import axios from "axios";
import { Button, CheckBox } from "@rneui/base";
import { Linking } from "react-native";
import { pick,types } from "react-native-document-picker";
import RNFS from 'react-native-fs';
import DeviceInfo from "react-native-device-info";

const CargaMasivaComponent =  ({props}) => {


    const [usuario, setUsuario] = React.useState(null);
    const [labels, setLabels] = React.useState(null);
    const [labelsArry, setLabelsArry] = React.useState([])
    const [BtnArry, setBtnArry] = React.useState([])
    const [dataInfo, setDataInfo] = React.useState([]);

    var url_api="";

    const getLabels = async ()=>{
        let data = '0|PCARGAMASIVA|E|B|@0@@|';
        var body = rqdata.getCarga('ProgramInquiry','I',data);
        var response = await axios.post(`${url_api}`,body);
        if(response.data.Json != ""){
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
            setLabels(lbs);
            setLabelsArry(dArr);
          }
    }

    const getButtons= async ()=>{
      let data = '0|1|';
      var body = rqdata.getCarga('INQBARRA','I',data);
      var response = await axios.post(`${url_api}`,body);
      if(response.data.Json != ""){
          let d = JSON.parse(response.data.Json);
          var btns = [];
          for (let i = 0; i < d['FINQBARRA'].length; i++) {
            const element = d['FINQBARRA'][i];
            btns.push(element.Titulo)
          }
          console.log(d);
          setBtnArry(btns);
        }
  }

    const getDataInfo = async (user)=>{
        let data = user['usukides'] + '|' + user['usidioma'] + '|';
        let body = rqdata.getCarga('CARGAMASIVAINQ','I',data);
        let response = await axios.post(`${url_api}`,body);
        console.log(response.data);
        if(response.data.Json != ''){
            let d = JSON.parse(response.data.Json);
            console.log(d['FCARGAMASIVAINQ']);
            setDataInfo(d['FCARGAMASIVAINQ']);
        }
    }

    const validateUser = async () => {
        let url = await AsyncStorage.getItem('api');
        url_api = url;

        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            setUsuario(res[0]);
            getLabels();
            getButtons();
            getDataInfo(res[0]);
            
        });
    }

    const OpenURLButton = async (url) => {
        console.log(url)
        if(url.includes('https') || url.includes('http')){
          await Linking.openURL(url);
        }
        
    }

    const getDocuments = async ()=>{
        try {

            let url = await AsyncStorage.getItem('api');
            url_api = url;

          const [result] = await pick({
            mode: 'open',
            allowMultiSelection: false,
            type: [types.xlsx, types.plainText, types.csv],
          })
          console.log('result',result)
          var file = await RNFS.readFile(result.uri, 'base64');
          var ext = result.name;
          ext = ext.split('.');
          var sizeExt = ext.length;
          console.log(ext[sizeExt-1])

          let dispositivo = DeviceInfo.getDeviceNameSync();
          var hora = ((new Date().getHours()<10)?(('0')+new Date().getHours()):new Date().getHours())+''+((new Date().getMinutes()<10)?(('0')+new Date().getMinutes()):new Date().getMinutes())+'00';
          var fecha = ((new Date().toISOString()).split('T')[0]).split('-');
          let fch = fecha[0]+''+fecha[1]+''+fecha[2];

          let data = usuario['usukides'] + '|' + usuario['usukiduser'] + '|' + dispositivo + '|' + 'PCARGAMASIVA' + '|' + fch + '|' + hora + '|';
          let body = rqdata.loadFunction('BulkLoad',data,file);
          console.log('bodyFile',body);

          var response = await axios.post(`${url_api}`,{Function:'BulkLoad',App:'Mi Appescolar',Parameter:body,json:file});
          console.log(response.data);
          getDataInfo(usuario);
          
        } catch (err) {
          // see error handling
          console.log(err)
        }
      }

      


    useEffect(() => {
        
        validateUser();
        return () => {
            return;
        }
    }, []);

    return (
        <View>
            <ButtonGroup
            buttons={BtnArry}
            selectedIndex={null}
            buttonStyle={{backgroundColor:'#E1E1E1'}}
            buttonContainerStyle={{borderColor:'gray'}}
            onPress={(value) => {
              console.log(value);
                if(value == 4){
                    getDocuments();
                }
            

            }}
            containerStyle={{ marginBottom: 20 }}
          />
          
            <ScrollView>
          {dataInfo.map((item,i) => {
            return(
                <ListItem style={{margin:10}} onPress={()=>OpenURLButton(item['FMPATHFOR'])}>
                    <ListItem.Content>
                    {labelsArry.map((label,x) => {
                        return(
                        <ListItem.Title key={label+x+i}>
                            <Text style={{fontWeight:900}}>{labels[label]}: </Text> {item[label]} 
                        </ListItem.Title>
                        )
                    })}
                    </ListItem.Content>
                </ListItem>

            )
          })}

        </ScrollView>
        </View>
    )
}


export default CargaMasivaComponent;