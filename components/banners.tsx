import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";

import * as rqdata from './params_request';
import storage from "../Storage";


const BannersComponent = ({navigation}) => {
    const formikRef = useRef();
    const [textinit, setExtInit] = React.useState('Bienvenido');
    const url_api = "http://20.64.97.37/api/products";
   

    useEffect(()=>{
        bannersItems();
    })


    const bannersItems = async () => {
        console.log('xxxx',rqdata.banners);
        var reponse = await axios.post(`${url_api}`,rqdata.banners);
        console.log(reponse.data);
        if(reponse.data.Json == ''){
            navigation.navigate('Home')
        }else{
            return false;
        }
    }
  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
        <View>
            <Text>Banners</Text>
        </View>
    </View>
    
  );
}




export default BannersComponent;