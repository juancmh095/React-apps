
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const api_service = async (type,app,func,parametros,json,cat,escuela) => {
    try {
        var usuario = await AsyncStorage.getItem('FUSERSLOGIN');
        var psw = await AsyncStorage.getItem('psw');
        usuario = JSON.parse(usuario)
        var api = await AsyncStorage.getItem('api');
        var params = {};


        /* datos complementarios de la funcion */
        let dispositivo = DeviceInfo.getDeviceNameSync();
        let dateDevice = new Date().toLocaleDateString('es-MX').split('/');
        let timeDevice = new Date().toLocaleTimeString('es-MX').split(' ')[0];
        let fechaD = dateDevice[0]+((Number(dateDevice[1])<9)?'0'+dateDevice[1]:dateDevice[1])+dateDevice[2];
        let rgx = /[:,/]/gm;
        let horaD = timeDevice.replace(rgx,'');


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
            if(type == 'FANEXO'){
                if(func == 'ReadAtach'){
                    params = {
                        id:1,
                        json:JSON.stringify({
                            Function: func,
                            App:app,
                            Base64:json,
                            Parameter:parametros
                        }),
                        Category: cat
                    }
                }else{
                    params = {
                        id:1,
                        json:JSON.stringify({
                            Function: func,
                            App:app,
                            Base64:json,
                            Parameter:parametros + usuario['ususer'] +'|'+fechaD+'|'+horaD+'|'+dispositivo+'|'
                        }),
                        Category: cat
                    }
                }
            }else{
                if(type == 'FUNC'){
                    params = {
                        id:1,
                        json:JSON.stringify({
                            Function: func,
                            App:app,
                            Parameter:parametros
                        }),
                        Category: cat
                    }

                }else{
                    if(type == 'FUNCUBE'){
                        params = {
                            id:1,
                            json:JSON.stringify({
                                Function:func,
                                Program: app,
                                Version:'MC0001',
                                user: usuario['ususer'],
                                psw: psw,
                                ID:"2",
                                Parameter:parametros
                            }),
                            Category: cat                           
                        }
                    }else{
                        if(type=='GLOTE'){
                            params = {
                                id:1,
                                json:JSON.stringify({
                                    Function:func,
                                    App:'Mi Appescolar',
                                    Program: app,
                                    user: usuario['ususer'],
                                    psw: psw,
                                    ID:"0",
                                    Parameter:parametros
                                }),
                                Category: cat                           
                            }
                        }else{
                            params = {
                                Function:func,
                                App: app,
                                Parameter:parametros,
                                json:json
                            }
                        }
                    }

                }
            }
        }
        
        console.log('request',params);
        let response = await axios.post(`${api}`,params);
        if(response.data.Json != ''){
            if(type == 'program'){
                let d = JSON.parse(response.data.Json);
                let keyObject = 'F'+func;
                return d[keyObject];
            }else{
                return [response.data.Json]
            }
        }else{
            return []
        }
        
    } catch (error) {
        return [];        
    }

};

export default api_service;