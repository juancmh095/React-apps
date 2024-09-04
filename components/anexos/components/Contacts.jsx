
import { PermissionsAndroid, StyleSheet, View, Text, ScrollView, ToastAndroid } from "react-native";
import React, { useEffect } from "react";
import Contacts from 'react-native-contacts';
import { Card, Image } from "@rneui/base";
import { Button } from "react-native-elements";
import axios from "axios";


const ContactsComponent = ({setModalVisible}) => {
  const _api = 'http://20.64.97.37/api/products';

  const [users, setUsers] = React.useState([]);
    
  const GetContacts = async () =>{
    try {
      const andoidContactPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
      console.log(andoidContactPermission)
      if (andoidContactPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Contacts Permission granted");
        Contacts.getAll()
        .then((contacts) => {
            // work with contacts
            console.log(contacts);
            
            setUsers(contacts);
        })
        .catch((e) => {
            console.log(e);
        })
      } else {
        console.log("Contacts permission denied");
      }
    } catch (err) {
      console.log('error',err);
    }
  
  }

  const saveContact = async (contacto) => {
    var phone = contacto.phoneNumbers[0]['number'];

    const regex = /[+,-]/gm;
    phone = phone.replace(regex,'');

    var contact = contacto.displayName + '-' + phone;
    var reponse = await axios.post(`${_api}`,{
      Id:1,
      json: JSON.stringify({
        Function:"WriteAtach",
        App:'Mi Appscolar',
        Base64:"",
        Parameter:"0|FUDC|55PL001|"+contact+"|Contacto|RROJAS|20240401|122300|DISPOSITIVO1|"
      }),
      Category:"Utilerias"
    });
    console.log(reponse.data);
    if(reponse.data.Json == 'OK'){
      showToast('Contacto guardado satisfactoriamente');
      setModalVisible(false);
    } else {
      showToast('Error al guardar')
    }
  }

  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };

  useEffect(() => {
    if (users.length == 0) {
      GetContacts();
    }
  });
 
  return (
    <View style={{height:'90%', overflow:'scroll'}}>
      <ScrollView>
        <Card style={{overflow:'scroll', height:'90%'}}>
            <Card.Title>Mis Contactos</Card.Title>

            {(users.length == 0 && (
              <View>
                <Text style={{fontSize:12, color:'black', textAlign:'center'}}>Cargando contactos</Text>
                <Button title="Cargando contactos" type="clear" loading />
              </View>
            ))}
            <Card.Divider />
            {users.map((u, i) => {
              return (
                <View key={i} style={styles.user}>
                  <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe'+u.displayName }}
                    onPress={ ()=> saveContact(u)}
                  />
                  <Text style={styles.name} onPress={ ()=> saveContact(u)}>{u.displayName} {u.phoneNumbers.length > 0?"\n"+u.phoneNumbers[0]['number']:''}</Text>
                </View>
              );
            })}
          </Card>
      </ScrollView>


    </View>
    
  );
}

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    marginTop: 5,
    color: 'black'
  },
});


export default ContactsComponent;