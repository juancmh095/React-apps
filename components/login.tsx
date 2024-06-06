import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";

import * as rqdata from './params_request';
import storage from "../Storage";


const LoginComponent = ({navigation}) => {
    const formikRef = useRef();
    const [textinit, setExtInit] = React.useState('Bienvenido');
    const url_api = "http://20.64.97.37/api/products";
   
    useEffect(() => {
        validateUser();
    })

    const validateUser = async () => {
        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            console.log('aqui el usuario',res);
            if(res.length > 0){
                navigation.navigate('Init')
            }
        });
    }
    
    
    const loginFunc = async () => {
        var forms = formikRef.current.values;
        
        let body = rqdata.encrypPass;
        let json = JSON.parse(body.json);
        json.Data = forms['password'];
        body.json = JSON.stringify(json);
        var reponse = await axios.post(`${url_api}`,body);
        if(reponse.data.Json){
            /* let pass = reponse.data.Json; */
            let pass = "JrVZl/C6Gr/dLBQMKJXJVA==";
            let body = rqdata.login;
            let json = JSON.parse(body.json);
            let row = json.Rows;
            let r = forms['user'] + "|"+pass+"|"
            row[0]['Data'] = r;
            json.Rows = row;
            body.json = JSON.stringify(json);
            var reponseLogin = await axios.post(`${url_api}`,body);
            console.log(reponseLogin.data.Json);
            if(reponseLogin.data.Json != ''){
                console.log('entra');
                let data = JSON.parse(reponseLogin.data.Json);
                storage.save({
                    key:'FUSERSLOGIN',
                    id:'1',
                    data: data['FUSERSLOGIN'][0]
                });
                navigation.navigate('Home')
            }
        }
    }


  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
        <View>
            <Formik
                initialValues={{user:'', password:''}}
                innerRef={formikRef}
                onSubmit={values => console.log(values)}
            >
                {({ handleChange, setFieldValue, handleSubmit, values }) => (
                    <View style={styles.inputs}>
                        <Text h4 style={{textAlign:'center'}}>{textinit}</Text>
                        <Input 
                            placeholder='Usuario'
                            leftIcon={
                                <Icon
                                    name='person'
                                    color='black'
                                    />
                            }
                            value={values.user}
                            onChangeText={handleChange('user')}
                            />
                        <Input 
                            placeholder='Password'
                            secureTextEntry={true}
                            leftIcon={
                                <Icon
                                name='https'
                                color='black'
                                />
                            }
                            value={values.password}
                            onChangeText={handleChange('password')}

                            />
                        <Button title={'Enviar'} onPress={() => loginFunc()}></Button>

                    </View>

                )}
            </Formik>
        </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
    inputs:{
        width:'80%',
        height:'60%',
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:'auto'
    }
})


export default LoginComponent;