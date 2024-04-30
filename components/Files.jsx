
import { PermissionsAndroid, StyleSheet, View, Text, ScrollView, Linking, Alert } from "react-native";
import React, { useCallback, useEffect } from "react";
import Contacts from 'react-native-contacts';
import { Card, Image, color } from "@rneui/base";
import axios from "axios";
import { Button } from "react-native-elements";

const FilesComponent = () => {

  const _api = 'http://20.64.97.37/api/products';
  const [files, setFiles] = React.useState([]);
    
  

  const saveContact = (contacto) => {
    console.log(contacto);
  }

  const getFiles = async () => {
    var reponse = await axios.post(`${_api}`,{
        Id:1,
        json: JSON.stringify({
          Function:"ReadAtach",
          Parameter:"0|FUDC|55PL001|"
        }),
        Category:"Utilerias"
      });
      var dataJS = JSON.parse(reponse.data.Json)
      console.log(dataJS["FINQFATTACHMENT"],'a');
      setFiles(dataJS["FINQFATTACHMENT"])
  }

 
  
  const OpenURLButton = async (url) => {
    
    await Linking.openURL(url);
    
}

  useEffect(() => {
    if(files.length == 0){
        getFiles();
    }
  });
 
  return (
    <View style={{height:'90%', overflow:'scroll'}}>
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