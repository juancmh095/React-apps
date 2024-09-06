
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api_service = async (type,app,func,parametros,json,cat,escuela) => {
    try {
        var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
        var psw = await AsyncStorage.getItem('psw');
        usuario = JSON.parse(usuario)
        var api = await AsyncStorage.getItem('api');
        var params = {};
        if(type == 'program'){
            params = {
                Id:1,
                json:JSON.stringify({
                    user:usuario['usukiduser'],
                    psw: psw,
                    Escuela: escuela,
                    Tipo:"App",
                    Tabla:func,
                    Rows:parametros
                }),
                Category:cat
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
            return d[keyObject];
        }else{
            return []
        }
        
    } catch (error) {
        return [];        
    }

};

export default api_service;