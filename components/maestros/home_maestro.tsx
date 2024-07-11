import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Icon, Image, Input, ListItem, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";
import { View } from "react-native";
import * as rqdata from '../params_request';
import storage from "../../Storage";

const MaestroHomeComponent = ({navigation}) => {
    const formikRef = useRef();
    const [usuario, setUsuario] = React.useState(null);
    const [acordion, setAcordion] = React.useState([]);
    const [expanded, setExpanded] = React.useState(null);
    const url_api = "http://20.64.97.37/api/products";
    
    useEffect(() => {
        
        validateUser();
        return () => {
            return;
        }
    }, []);

    const validateUser = async () => {
        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            setUsuario(res[0]);
            console.log(res[0]);
            load_form_inputs();
        });
    }

    const load_form_inputs = async () => {

        var usukides = usuario['usukides']
        var usukiduser = usuario['usukiduser']
        var year = new Date().getFullYear();
        var dateStr = '20240711';

        console.log(usukides,usukiduser)

        let body = rqdata.labels;
        let json = JSON.parse(body.json);
        json.Tabla = 'MENUS1';
        let row = json.Rows;

        let r = usukides + '|' +usukiduser + '|' + year + '|' + dateStr + '|'
        row[0]['Data'] = r;
        json.Rows = row;
        body.json = JSON.stringify(json);
        console.log(body)
        var reponse = await axios.post(`${url_api}`,body);
        if(reponse.data.Json != ''){
            var datx = JSON.parse(reponse.data.Json);
            console.log(datx['FMENUS1'])
            setAcordion(datx['FMENUS1']);
        }
    }  
    
  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
       <Text>Home maestros</Text>
       <ListItem.Accordion
            content={
                <>
                <Icon name="place" size={30} />
                <ListItem.Content>
                    <ListItem.Title>List Accordion</ListItem.Title>
                </ListItem.Content>
                </>
            }
            isExpanded={expanded}
            onPress={() => {
                setExpanded(!expanded);
            }}
            >
                
                <ListItem key={0} bottomDivider>
                    <Avatar title={'test'} source={{ uri: 'x' }} />
                    <ListItem.Content>
                        <ListItem.Title>{'test'}</ListItem.Title>
                        <ListItem.Subtitle>{'test'}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
        </ListItem.Accordion>
    </View>
    
  );
}




export default MaestroHomeComponent;