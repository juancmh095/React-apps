
import { PermissionsAndroid, StyleSheet, View, Text, ScrollView } from "react-native";
import React, { useEffect } from "react";
import Contacts from 'react-native-contacts';
import { Card, Image } from "@rneui/base";

const ContactsComponent = () => {

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

  const saveContact = (contacto) => {
    console.log(contacto);
  }

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