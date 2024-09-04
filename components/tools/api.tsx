
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api_service = async function(api,type, program, app,func,parametros,json){
    var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
    var api = await AsyncStorage.getItem('api');
    console.log(usuario);
    var params = {};
    if(type == 'program'){
        params = {
            Id:1,
            json:JSON.stringify({
                Function: func,
                App:app,
                Program:program,
                user:user,
                psw:psw,
                ID:'0',
                Parameter: parametros
            }),
            Category:"Utilerias"
        }
    }else{
        params = {
            Function:func,
            App: app,
            Parameter:parametros,
            json:json
        }
    }

    let response = await axios.post(`${api}`,params);
    if(response.data.Json != ''){
        let d = JSON.parse(response.data.Json);
        let keyObject = 'F'+func;
        console.log(d[keyObject]);
        return d[keyObject];
    }else{
        return []
    }

};

module.exports = api_service;