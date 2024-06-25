import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Icon, Image, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";

import * as rqdata from './params_request';
import storage from "../Storage";


const BannersComponent = ({navigation}) => {
    const formikRef = useRef();
    const [textinit, setExtInit] = React.useState('Bienvenido');
    const [images, setImages] = React.useState([]);
    const url_api = "http://20.64.97.37/api/products";
    const [indexImg, setIndexImg] =  React.useState(0);

    useEffect(()=>{
        bannersItems();
        return () => {
            return false;
        };
    },[])


    const bannersItems = async () => {
        var reponse = await axios.post(`${url_api}`,rqdata.banners);
        if(reponse.data.Json == ''){
            navigation.navigate('Home')
        }else{
            var data = JSON.parse(reponse.data.Json);
            console.log('---->',data);
            var imgs = data['FProgramInquiry'];
            console.log(imgs);
            setImages(imgs);
            return false;
        }
    }

    const bannerOp = async (type) => {
        var idx = 0;
        if(type == 'next'){
            console.log(images.length)
            if(indexImg < (images.length-1)){
                idx = indexImg + 1; 
            }else{
                if((indexImg + 1) > (images.length - 1)){
                    navigation.navigate('Home')
                }
            }

        }else{
            if(indexImg > 0){
                idx = indexImg - 1; 
            }
        }

        setIndexImg(idx);
    }
  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
        <View>
            
            {(images.length > 0 && (
                
                <View>
                    <Text>{indexImg}</Text>
                    <Image
                        source={{ uri: images[indexImg].PLURL}}
                        style={{width:'100%', height:'80%'}}
                    />
                </View>
            ))}

    <View style={{flexDirection:'row', flexWrap:'wrap'}}>
        <View style={{width:'48%', marginRight:'auto', marginLeft:0}}>
            <Button type="clear" title={'Anterior'}  onPress={()=> bannerOp('back')}/>
        </View>
        <View style={{width:'48%', marginRight:'auto', marginEnd:0}}>
            <Button type="clear" title={'Siguiente'} onPress={()=> bannerOp('next')} />
        </View>
    </View>

          
        </View>
    </View>
    
  );
}




export default BannersComponent;