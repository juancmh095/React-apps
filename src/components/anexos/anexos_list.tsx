
import { PermissionsAndroid, StyleSheet, View, Text, ScrollView, Linking, Alert } from "react-native";
import React, { useCallback, useEffect } from "react";
import Contacts from 'react-native-contacts';
import { ButtonGroup, Card, Image, color } from "@rneui/base";
import axios from "axios";
import { Button } from "react-native-elements";

import  {default as _apiServices} from '../tools/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContext } from "@react-navigation/native";

const FilesComponent = (props) => {

  const _api = 'http://20.64.97.37/api/products';
  const [files, setFiles] = React.useState([]);
  const navigation = React.useContext(NavigationContext);
    
  

  const saveContact = (contacto) => {
    console.log(contacto);
  }

  const getFiles = async () => {
    var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
    usuario = JSON.parse(usuario);

    var dataRoute = props['route']['params'];
    var params = usuario['usukides']+'|'+dataRoute['Programa']+'|'+dataRoute['COVERSIONTO']+'|';
    var response = await await _apiServices('program','Mi App','INQFATTACHMENT',[{action:'I', Data:params}],'','Mi App','0');
    
      
      console.log('response',response, dataRoute,params);
      setFiles([...response])
  }

 
  
  const OpenURLButton = async (url) => {
    
    await Linking.openURL(url);
    
}

  useEffect(() => {
    if(files.length == 0){
        getFiles();
    }
  },[]);
 
  return (
    <View style={{height:'90%', overflow:'scroll'}}>
        <ButtonGroup
            buttons={['Cancelar','Agregar']}
            selectedIndex={null}
            buttonStyle={{backgroundColor:'#E1E1E1'}}
            buttonContainerStyle={{borderColor:'gray'}}
            onPress={(value) => {
              console.log(value);
                if(value == 0){
                    navigation.navigate('Home');
                }else{
                   
                    navigation.push('Anexos',props['route']['params']);
                }
            

            }}
            containerStyle={{ marginBottom: 20 }}
          />
      <ScrollView>
      {files.map((u, i) => {
        return (
            <Card  key={i} style={styles.user}>
                <Text style={styles.stxt}>{u.ATMOTYPE}</Text>
                <Text style={styles.txt}>{u.ATFILENAME}</Text>
                <Text style={{color:'black'}}>Fecha: {u.FECHA}</Text>
                
                {(u.ATMOTYPE != 'URL' && u.ATMOTYPE != 'GEO' && u.ATMOTYPE != 'TXT' && u.ATMOTYPE && (
                    <Button title="Descargar" type="clear" style={{color:'black'}} onPress={()=>OpenURLButton(u.URL)}></Button>

                ))}
                {(u.ATMOTYPE == 'URL'&& (
                    <Button title="Ir" type="clear" style={{color:'black'}} onPress={()=>OpenURLButton(u.URL)}></Button>

                ))}
            </Card>
          );
        
      })}
      </ScrollView>


    </View>
    
  );
}

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    marginBottom: 6,
    color:'black'
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  txt: {
    fontSize: 18,
    marginTop: 5,
    color: 'black'
  },
  stxt: {
    fontSize: 10,
    marginTop: 5,
    color: 'black'
  },
});


export default FilesComponent;