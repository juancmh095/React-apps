import React, { useEffect, useRef, useState } from "react";
import { ListItem } from '@rneui/base';
import { Avatar, Button, ButtonGroup, Icon, Image, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";
import { ScrollView, View, Modal, ToastAndroid, Linking, StyleSheet, PermissionsAndroid } from "react-native";
import * as rqdata from '../../components/tools/params_request';
import storage from "../../services/Storage";
import { Picker } from "@react-native-picker/picker";
import Geolocation from 'react-native-geolocation-service';
import HomeComponent from '../../../components/App.tsx';
import ModuleComponent from '../../../components/Module.tsx';
import AsyncStorage from "@react-native-async-storage/async-storage";
import  ButtomBarModule  from '../../components/buttomBar';

import  {default as _apiServices} from '../../components/tools/api.tsx';

const TutorHomeComponent = ({navigation}) => {
    const formikRef = useRef();
    const [usuario, setUsuario] = React.useState(null);
    
    const [btnBNames, setBtnBNames] = React.useState([]);
    const [btnBCode, setBtnBCode] = React.useState([]);
    const [btnTNames, setBtnTNames] = React.useState([]);
    const [btnTCode, setBtnTCode] = React.useState([]);

    const [checkH, setCheckH] = React.useState([]);

    const [acordion, setAcordion] = React.useState([]);
    const [dataChecks, setDataChecks] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [modalProgramVisible, setModalProgramVisible] = React.useState(false);
    const [modalProgramVisible2, setModalProgramVisible2] = React.useState(false);
    const [modalProgramVisible3, setModalProgramVisible3] = React.useState(false);
    const [modalVisible3, setModalVisible3] = React.useState(false);
    const [modalVisible4, setModalVisible4] = React.useState(false);
    const [params_view, setParams_view] = React.useState(null);
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
            console.log('Usuario',res[0]);
            load_form_inputs(res[0]);
            
        });
    }

    const showBarra = async () => {
        let body = rqdata.labels;
        let json = JSON.parse(body.json);
        json.Tabla = 'BARRAPROGRAM';
        let row = json.Rows;

        let r = '0|PMENUS|';
        row[0]['Data'] = r;
        json.Rows = row;
        json.action = 'I';
        body.json = JSON.stringify(json);
    }
    
    const load_form_inputs = async (userx) => {

        var usukides = userx['usukides']
        var usukiduser = userx['usukiduser']
        var year = new Date().getFullYear();
        var dateStr = '20240711';

        let body = rqdata.labels;
        let json = JSON.parse(body.json);
        json.Tabla = 'MENUS1';
        let row = json.Rows;

        let r = usukides + '|' +usukiduser + '|' + year + '|' + dateStr + '|'
        row[0]['Data'] = r;
        json.Rows = row;
        body.json = JSON.stringify(json);
        console.log('menuuuuuu',body)
        var reponse = await axios.post(`${url_api}`,body);
        if(reponse.data.Json != ''){
            var datx = JSON.parse(reponse.data.Json);
            //console.log(datx['FMENUS1'])
            var rData = datx['FMENUS1'];

            var menuItems:any = [];

            for (let i = 0; i < rData.length; i++) {
                const element = rData[i];
                let m = {
                    Idmenu: element['Idmenu'],
                    Programa: element['Programa'],
                    Menu: element['Menu'],
                    Opciones: null,
                    Expand: false
                };
                var fItem = menuItems.filter((item:any) => item.Menu === m.Menu);
                if(fItem.length == 0){
                    if(element['Expand'] == 'S'){
                        m.Expand = true
                    }
                    menuItems.push(m);
                }
            }

            for (let i = 0; i < menuItems.length; i++) {
                const element = menuItems[i];
                var opt = rData.filter((item:any) => item.Menu === element.Menu)
                menuItems[i]['Opciones'] = opt;
                if(element['Programa'] == 'PHIJOS'){
                    var chks = []
                    for (let x = 0; x < opt.length; x++) {
                        chks.push(true);                        
                    }
                    console.log(element['Programa'],opt.length,chks);
                    setCheckH([...chks]);
                }
            }

            setAcordion(menuItems);
        }
    }  

    const showProgram = async (item) => {
        try {
            var alumno = null;
            var alumnosName = '';
            var alumnos = [];
            var motivos = [];
            
            for (let i = 0; i < acordion[0]['Opciones'].length; i++) {
                const element = acordion[0]['Opciones'][i];
                if(checkH[i]){
                    console.log('alumnos ------>',element);

                    alumnosName = alumnosName + element['Opcion'] + ', ';
                    alumnos.push(element)
                    alumno = element;
                }
            }

            if(item == 'PTIPOSAL'){
                console.log('_________________________________')
                let body = rqdata.getData;
                let json = JSON.parse(body.json);
                json.Tabla = 'UDCINQ';
                json.Rows = [{action:'I', Data: usuario['usukides']+'|TIPOSAL||'+usuario['usidioma']+'|' }];
                body.json = JSON.stringify(json);
                console.log('response',body);
                let reponse = await axios.post(`${url_api}`,body);
                console.log('response',reponse.data);
                if(reponse.data.Json != ""){
                    var datx = JSON.parse(reponse.data.Json);
                    motivos = datx['FUDCINQ'];
                    console.log(datx['FUDCINQ']);
                }

            }

            if(item == 'PINASISTENCIA'){
                console.log('_________________________________')
                let body = rqdata.getData;
                let json = JSON.parse(body.json);
                json.Tabla = 'UDCINQ';
                json.Rows = [{action:'I', Data: usuario['usukides']+'|INASISTIR||'+usuario['usidioma']+'|' }];
                body.json = JSON.stringify(json);
                console.log('response',body);
                let reponse = await axios.post(`${url_api}`,body);
                console.log('response',reponse.data);
                if(reponse.data.Json != ""){
                    var datx = JSON.parse(reponse.data.Json);
                    motivos = datx['FUDCINQ'];
                    console.log(datx['FUDCINQ']);
                }

            }

            
            
            let model = {
                Programa: item,
                alumno: alumno,
                motivos: motivos,
                alumnos: alumnos,
                alumnosName: alumnosName
            }

            setData(model);
            
            setModalProgramVisible3(true);

        } catch (error) {
            console.log('error',error);
        }
        
    }

    function calcularDistancia(lat1, lon1, lat2, lon2) {
        const R = 6378.137; // Radio de la Tierra en kilómetros
        const dLat = gradosARadianes(lat2 - lat1);
        const dLon = gradosARadianes(lon2 - lon1);
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(gradosARadianes(lat1)) * Math.cos(gradosARadianes(lat2)) * 
          Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var distancia = R * c; // Distancia en kilómetros
        distancia = distancia * 1000;
        return distancia;
    }
      
    function gradosARadianes(grados) {
    return grados * (Math.PI / 180);
    }

    const checkin = async () => {

        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        

        Geolocation.getCurrentPosition(
            async (position) => {
                try {
                    let bodGeo = rqdata.getData;
                    let json2 = JSON.parse(bodGeo.json);
                    console.log('aquis',bodGeo);
                    json2.Tabla = 'PUNTOS1';
                    let row2 = json2.Rows;
                    let r2 = usuario['usukides'] + '|2|';
                    row2[0]['Data'] = r2;
                    row2[0]['action'] = 'I';
                    json2.Rows = row2;
                    bodGeo.json = JSON.stringify(json2);
                    var geoSh = await axios.post(`${url_api}`,bodGeo);
                    if(geoSh.data.Json != ""){
                        var pts = JSON.parse(geoSh.data.Json);
                        var infoSc = pts['FPUNTOS1'][0];
                        console.log('geo',infoSc)
                    }
    
    
                    
                    var p = position['coords'];
                    var pSh = infoSc['PUGEO'].split(',');
                    var distanciaTotal = await calcularDistancia(p['latitude'],p['longitude'],pSh[0],pSh[1]);
    
                    console.log('distancia de puntos',distanciaTotal)
    
                    if(Number(distanciaTotal) <= Number(infoSc['PURANGO'])){
                        for (let i = 0; i < acordion[0]['Opciones'].length; i++) {
                            const element = acordion[0]['Opciones'][i];
                
                            if(checkH[i]){
                                console.log(checkH)
                                let body = rqdata.getData;
                                let json = JSON.parse(body.json);
                                json.Tabla = 'salidacheckin';
                                let row = json.Rows;
                                var hora = ((new Date().getHours()<10)?(('0')+new Date().getHours()):new Date().getHours())+''+((new Date().getMinutes()<10)?(('0')+new Date().getMinutes()):new Date().getMinutes())+'00';
                                let r = 'C|'+usuario['usukides'] + '|' + element['idAlumno'] + '|'+hora+'|'+infoSc['PUPUNTO']+'|'+Math.floor(Number(distanciaTotal))+'|';
                                row[0]['Data'] = r;
                                row[0]['action'] = 'C';
                                json.Rows = row;
                                body.json = JSON.stringify(json);
                                var reponse = await axios.post(`${url_api}`,body);
                                console.log(reponse.data)
                            }
                            
                            let bodyl = {
                                Id:1,
                                json:JSON.stringify({
                                  user:"2",
                                  psw:"JrVZl/C6Gr/dLBQMKJXJVA==",
                                  Escuela:"2",
                                  Tipo: "App",
                                  Tabla:"HABLARBOCAPP",
                                  Rows:[{
                                    action:"A",
                                    Data:usuario['usukides'] + '|'+ usuario['usukiduser'] + '|' + element['idAlumno'] + '|'
                                  }]
                                }),
                                Category:"Mi App"                          
                            };
                            var resLLamado = await axios.post(`${url_api}`,bodyl);
                            console.log(resLLamado.data);
    
    
                        }
                        ToastAndroid.show('Checking Correcto', ToastAndroid.LONG);
                    }else{
                        ToastAndroid.show('Rango No Permitido', ToastAndroid.LONG);
                    }
                    
                } catch (error) {
                    console.log(error);
                }
        
            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );   
    }

    const goTo = async (programa) => {

        var url = await AsyncStorage.getItem('api');
        let url_api = url;
        console.log('->',programa)
        if(programa == 'PLOTE'){
            navigation.navigate('Home')
        }
        
        if(programa == 'PREPORTS'){
            console.log(programa)
            try {
                var reponse = await axios.post(`${url_api}`,rqdata.inputs_preport);
                
                var dataSelect = {};
                var modelSelect = {};
                var dtaSelect = [];
                if(reponse.data.Json){
                    let d = JSON.parse(reponse.data.Json);
                    console.log(d);  
                    for (let i = 0; i < d.FProgramInquiry.length; i++) {
                    const element = d.FProgramInquiry [i];
                    if(element.UDUDC != ""){
                        dtaSelect.push(element.UDUDC);
                    }
                    }
                }
            
                /* CARGA LA DATA DE LOS SELECTS 1 */
                for (let y = 0; y < dtaSelect.length; y++) {
                    const element = dtaSelect[y];
                    let body = rqdata.get_data_selects;
                    let json = JSON.parse(body.json);
                    let row = json.Rows;
                    let r = "0|"+element+"|1|";
                    row[0]['Data'] = r;
                    json.Rows = row;
                    body.json = JSON.stringify(json);
                    var catR1 = await axios.post(`${url_api}`,body);
                        
                    if(catR1.data.Json){
                        let d = JSON.parse(catR1.data.Json);
                        modelSelect[element] = d.FPGMINQUIRY;
                    }
                    
                }
                
            
                
            
                let datax = {
                    titulo: 'Reportes',
                    data: {},
                    program: programa,
                    cat: modeSelect
                };
            
                console.log(datax)
            
                setParams_view(datax);
                setModalVisible3(true);
            
                console.log(model,datax,params);
                
            } catch (error) {
                console.log(error)
            }
        }

        if(programa == 'PCOMPRAS'){
            navigation.navigate('Compra')
        }

        if(programa == 'PJOBS'){
            let datax = {
                titulo: 'Reportes enviados',
                data: [],
                program: 'PJOBS',
                cat: [],
                report: ''
              };  
              setParams_view(datax);
              setModalVisible4(true);
        }

        if(programa == 'PCARGAMASIVA'){
            navigation.navigate('Carga')
        }
    }

    const checkout = async () => {

        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        Geolocation.getCurrentPosition(
            async (position) => {
            var latlong = "";
              var p = position['coords'];
              latlong = p['latitude']+','+p['longitude'];

              console.log(latlong);

                for (let i = 0; i < acordion[0]['Opciones'].length; i++) {
                    const element = acordion[0]['Opciones'][i];

                    if(checkH[i]){
                        let body = rqdata.getData;
                        let json = JSON.parse(body.json);
                        json.Tabla = 'salidacheckout';
                        let row = json.Rows;
                        var hora = ((new Date().getHours()<10)?(('0')+new Date().getHours()):new Date().getHours())+''+((new Date().getMinutes()<10)?(('0')+new Date().getMinutes()):new Date().getMinutes())+'00';
                        var fech = (new Date().toISOString()).split('T')[0];
                        fech = fech.split('-');
                        var realF = fech[2]+'/'+fech[1]+'/'+fech[0]
                        console.log(realF)
                        let r =  'C|'+usuario['usukides'] + '|' + element['idAlumno'] + '|'+hora+'|'+realF+'|'+latlong+'|';
                        row[0]['Data'] = r;
                        row[0]['action'] = 'C';
                        json.Rows = row;
                        body.json = JSON.stringify(json);
                        console.log(body);
                        var reponse = await axios.post(`${url_api}`,body);
                        console.log(reponse.data);
                        ToastAndroid.show('Check Out Correcto', ToastAndroid.LONG);
                    }
                }

            },
            (error) => {
              // See error code charts below.
              console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      
        

    }
    
  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
         <ScrollView>
            <View>
            <ButtonGroup
            buttons={['No Asisitir','Salida','Tutor','Check In', 'Check out']}
            selectedIndex={null}
            buttonStyle={{backgroundColor:'#E1E1E1'}}
            buttonContainerStyle={{borderColor:'gray'}}
            onPress={(value) => {
              
                
                if(value == 3){
                    checkin()
                }

                if(value == 4){
                    checkout()
                }

                if(value == 0){
                    showProgram('PNOASISTIR');
                }

                if(value == 1){
                    showProgram('PTIPOSAL');
                }
                if(value == 2){
                    showProgram('PCAMBIOTUTOR');
                }

            }}
            containerStyle={{ marginBottom: 20 }}
          />
                {acordion.map((item,i) => {
                        return(
                            <View>
                                <ListItem.Accordion
                                    content={
                                        <>
                                        <ListItem.Content>
                                            <ListItem.Title>{item.Menu}</ListItem.Title>
                                        </ListItem.Content>
                                        </>
                                    }
                                    isExpanded={item.Expand}
                                    onPress={() => {
                                        acordion[i]['Expand'] = !item.Expand;
                                        setAcordion([...acordion])
                                    }}
                                    >
                                        {item.Opciones.map((option,i) => {
                                                return(
                                                    <View style={{'marginStart':50, borderBottomColor:'gray', borderBottomWidth:1}}>
                                                        <ListItem key={0} bottomDivider onPress={()=> {
                                                            if(option['Programa'] == 'PLOTE' || option['Programa'] == 'PREPORTS' || option['Programa'] == 'PJOBS' || option['Programa'] == 'PCARGAMASIVA' || option['Programa'] == 'PCOMPRAS'){
                                                                //goTo(option['Programa'])
                                                            }
                                                            
                                                            navigation.navigate('Program',option)
                                                            console.log(option)
                                                        }}>
                                                            <ListItem.Content>
                                                                <ListItem.Title>{option.Opcion}</ListItem.Title>
                                                            </ListItem.Content>
                                                            <ListItem.Chevron />

                                                            {((option['Programa'] == 'PHIJOS' || option['Programa'] == 'PDIA') && (<ListItem.CheckBox
                                                                iconType="material-community"
                                                                checkedIcon="checkbox-marked"
                                                                uncheckedIcon="checkbox-blank-outline"
                                                                checked={checkH.length > 0?checkH[i]:true}
                                                                onPress={() => { 
                                                                    checkH[i] = !checkH[i];
                                                                    setCheckH([...checkH]);
                                                                }}
                                                            />))}
                                                        </ListItem>
                                                    </View>
                                                )
                                        })}
                                </ListItem.Accordion>
                            </View>
                        )
                    })}
                
            </View>
         </ScrollView>
         <ButtomBarModule program={'PMENUS'} OPFORMA={'WMENUSA'} />
         <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalProgramVisible}
          >
            <View>
                {formScreenBuild(setModalProgramVisible,data,usuario, dataChecks)}        
            </View>
          </Modal>

          <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalProgramVisible2}
          >
            <View>
                {formScreenBuildV2(setModalProgramVisible2,data,usuario,[])}        
            </View>
          </Modal>
          <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalProgramVisible3}
          >
            <View>
                {buildFormV3(setModalProgramVisible3,data,usuario)}        
            </View>
          </Modal>
          <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalVisible3}
            >
            <View>
              <View>
                <HomeComponent setModalVisible3={setModalVisible3} data={params_view} />                
              </View>
            </View>
          </Modal>
          <Modal
            style={{width:'100%',height:'100%'}}
            animationType="slide"
            transparent={false}
            visible={modalVisible4}
            >
            <View>
              <View>
                <ModuleComponent setModalVisible={setModalVisible4} data={params_view}/>                
              </View>
            </View>
          </Modal>
    </View>
    
  );
}

function formScreenBuild(setModalProgramVisible,data,usuario, dataChecks){
    console.log(usuario);

    const url_api = "http://20.64.97.37/api/products";
    var info = data.opcion?data.opcion:"";
    info = info.split(' ');
    data.list = data.list?data.list:[];
    data.checks = data.checks?data.checks:[];
    const [arrData, setArrData] = React.useState(dataChecks);
    const [labels, setLabels] = React.useState({});

    const getLabels =  async ()=>{
        var idioma = await AsyncStorage.getItem('idioma');
        const response = await _apiServices('program','','LABELS',[{action:"I",Data:"PASISTENCIA|"+idioma+"|"}],{},'Mi App','0');
        console.log('bottomXXXXXXXXXXXXXXXXXXXXXXXXXXXX',response,idioma)
        if(response.length > 0){
            setLabels({...response[0]})
        }
    }

    useEffect(() => {
        getLabels();
    },[])

    const ejecutar = async () => {
        if(data.item['Programa'] == 'PDIA'){
            console.log(dataChecks,arrData);
            //var year = new Date().getFullYear();
            var year = 2023;
            var regs = [];
            for (let i = 0; i < dataChecks.length; i++) {
                if(dataChecks[i]){
                    console.log(i,'-el usuario a guardar');
                    let regx = 'A'+'|'+usuario['usukides']+'|'+data.list[i]['agukidalumno']+'|'+year+'|'+data.item['grukidgr']+'|'+data.item['maukima']+'|'+usuario['usukiduser']+'|'+usuario['ususer'] + '|Cargamasiva|Server|0|0|1||';
                    regs.push({action:'A',Data:regx});
                }else{
                    let regx = 'A'+'|'+usuario['usukides']+'|'+data.list[i]['agukidalumno']+'|'+year+'|'+data.item['grukidgr']+'|'+data.item['maukima']+'|'+usuario['usukiduser']+'|'+usuario['ususer'] + '|Cargamasiva|Server|0|0|0||';
                    regs.push({action:"A",Data:regx});
                }
                
            }
            var Rows = JSON.stringify(regs);
            console.log(Rows);
            let body = rqdata.getData;
            let json = JSON.parse(body.json);
            json.Tabla = 'ASISTENCIA';
            json.Rows = Rows;
            body.json = JSON.stringify(json);
            console.log('response',body);
            let reponse = await axios.post(`${url_api}`,body);
            console.log('response',reponse.data);
            if(reponse.data){
                setModalProgramVisible(false);
                ToastAndroid.show('Correcto', ToastAndroid.LONG);
            }

        }
    }

    return(
            <View>
                <ButtonGroup
                    buttons={['Guardar','Cancelar','Errores']}
                    selectedIndex={null}
                    buttonStyle={{backgroundColor:'#E1E1E1'}}
                    buttonContainerStyle={{borderColor:'gray'}}
                    onPress={(value) => {
                    
                    if(value == 1){
                        setModalProgramVisible(false);
                    }
                    
                    if(value == 0){
                        ejecutar()
                    }
                    }}
                    containerStyle={{ marginBottom: 20 }}
                />
                <Text style={{fontWeight:900, margin:10, fontSize:16}}>Nivel: <Text style={{fontWeight:500, fontSize:16}}>{info[1]}</Text></Text>
                <Text style={{fontWeight:900, margin:10, fontSize:16}}>Materia: <Text style={{fontWeight:500, fontSize:16}}>{info[3]}</Text></Text>
                <Text style={{fontWeight:900, margin:10, fontSize:16}}>Grado: <Text style={{fontWeight:500, fontSize:16}}>{info[2]}</Text></Text>

                <View style={{width:'80%', marginStart:'auto', marginEnd:'auto'}}>
                    { data.list.map((item,i) => {
                        return(
                            <View>
                                <ListItem bottomDivider>                
                                    <ListItem.Content>
                                        <ListItem.Title>{item.Alumno}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                    <ListItem.CheckBox
                                        iconType="material-community"
                                        checkedIcon="checkbox-marked"
                                        uncheckedIcon="checkbox-blank-outline"
                                        checked={dataChecks[i]?true:false}
                                        onPress={() => {
                                            dataChecks[i] = !dataChecks[i] 
                                            arrData[i] = !arrData[i]
                                            setArrData([...arrData]);
                                            console.log('x',arrData);
                                        }}
                                    />
                                </ListItem>
                            </View>
                        )
                    })}
                </View>
                
            </View>
    )
}

function formScreenBuildV2(setModalProgramVisible,data,usuario,checks){
    console.log(usuario);

    const url_api = "http://20.64.97.37/api/products";
    var info = data.opcion?data.opcion:"";
    info = info.split(' ');
    data.list = data.list?data.list:[];

    const [modalVisible, setModalVisible] = React.useState(false);

    const [alumno, setAlumno] = React.useState(null);
    const [telefonos, setTelefonos] = React.useState(null);

    const entrega = async (item) => {
            var hora = (new Date().getHours())+''+(new Date().getMinutes())+'00';
            let body = rqdata.getData;
            let json = JSON.parse(body.json);
            json.Tabla = 'salidamaestro';
            json.Rows = [{action:'C', Data: 'C|'+usuario['usukides']+'|'+item['idAlumno']+'|'+usuario['usukiduser']+'|'+hora+'|' }];
            body.json = JSON.stringify(json);
            console.log('response',body);
            let reponse = await axios.post(`${url_api}`,body);
            console.log('response',reponse.data);
            ToastAndroid.show('Entrega Correcta', ToastAndroid.LONG);
    }

    const action = async (i) => {
        console.log(i,alumno)
        if(alumno != null && Object.keys(alumno).length > 0){
            if(i == 1){
                let body = rqdata.getData;
                let json = JSON.parse(body.json);
                json.Tabla = 'HABLARBOCAPP';
                json.Rows =  [{action:'A', Data: usuario['usukides']+'|0|'+alumno['idAlumno']+'|' }];
                body.json = JSON.stringify(json);
                console.log('response',body);
                let reponse = await axios.post(`${url_api}`,body);
                console.log('response',reponse.data);
                ToastAndroid.show('Alumno Anunciado', ToastAndroid.LONG);
            }

            if(i == 2){
                let body = rqdata.getData;
                let json = JSON.parse(body.json);
                json.Tabla = 'TUTORTEL';
                json.Rows =  [{action:'I', Data: usuario['usukides']+'|'+alumno['idAlumno']+'|' }];
                body.json = JSON.stringify(json);
                console.log('response',body);
                let reponse = await axios.post(`${url_api}`,body);
                setModalVisible(true);
                console.log('response',reponse.data);
                if(reponse.data.Json != ''){
                    let datxa = JSON.parse(reponse.data.Json);
                    console.log(datxa['FTUTORTEL'])
                    setTelefonos(datxa['FTUTORTEL']);
                }else{
                    setTelefonos([]);
                }
            }
        }else{
            ToastAndroid.show('Selecciona un alumno', ToastAndroid.LONG);

        }
    }

    return(
            <View>
                <ButtonGroup
                    buttons={data.bar}
                    selectedIndex={null}
                    buttonStyle={{backgroundColor:'#E1E1E1'}}
                    buttonContainerStyle={{borderColor:'gray'}}
                    onPress={(value) => {
                    
                    if(value == 3){
                        setModalProgramVisible(false);
                    }
                    
                    if(value != 3){
                        /* ejecutar() */
                        action(value);
                    }
                    }}
                    containerStyle={{ marginBottom: 20 }}
                />
                <Text style={{fontWeight:900, margin:10, fontSize:16}}>Nivel: <Text style={{fontWeight:500, fontSize:16}}>{info[1]}</Text></Text>
                <Text style={{fontWeight:900, margin:10, fontSize:16}}>Materia: <Text style={{fontWeight:500, fontSize:16}}>{info[3]}</Text></Text>
                <Text style={{fontWeight:900, margin:10, fontSize:16}}>Grado: <Text style={{fontWeight:500, fontSize:16}}>{info[2]}</Text></Text>

                <View style={{width:'80%', marginStart:'auto', marginEnd:'auto'}}>
                    {data.list.map((item,i) => {
                        return(
                            <View>
                                <ListItem.Swipeable
                                    key={i}
                                    leftContent={(action) => (
                                        <Button
                                        containerStyle={{
                                            flex: 1,
                                            justifyContent: "center",
                                        }}
                                        type="clear"
                                        icon={{
                                            name: "check",
                                            type: "material-community",
                                        }}
                                        onPress={() => { entrega(item);}}
                                        />
                                    )}
                                      onPress={()=> { setAlumno(item); }}
                                >
                                    <ListItem.Content>
                                        <ListItem.Title>{item.Alumno}</ListItem.Title>
                                        <ListItem.Subtitle>{item.Tutor1}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem.Swipeable>
                            </View>
                        )
                    })}
                </View>

                <Modal
                    style={{width:'100%',height:'100%'}}
                    animationType="slide"
                    transparent={false}
                    visible={modalVisible}
                >
                    <View>
                        <ButtonGroup
                            buttons={['Salir']}
                            selectedIndex={null}
                            buttonStyle={{backgroundColor:'#E1E1E1'}}
                            buttonContainerStyle={{borderColor:'gray'}}
                            onPress={(value) => {                            
                                if(value == 0){
                                    setModalVisible(false);
                                }
                            }}
                            containerStyle={{ marginBottom: 20 }}
                        />
                        <Text style={{fontWeight:900, margin:10, fontSize:16}}>Nivel: <Text style={{fontWeight:500, fontSize:16}}>{alumno?alumno['Alumno']:''}</Text></Text>
                        <Text style={{fontWeight:900, margin:10, fontSize:16}}>Materia: <Text style={{fontWeight:500, fontSize:16}}>{alumno?alumno['Grado']:''}{alumno?alumno['Grupo']:''}</Text></Text>
                        <Text>Hola</Text>  

                        
                        <View style={{width:'80%', marginStart:'auto', marginEnd:'auto'}}>
                            {(telefonos?telefonos:[]).map((item,i) => {
                                return(
                                    <View>
                                        <ListItem 
                                            bottomDivider
                                            onPress={() => {
                                                Linking.openURL(`tel:${item['Telefono']}`);
                                            }}
                                        >
                                            <ListItem.Content>
                                            <ListItem.Title>{item['Tutor']}</ListItem.Title>
                                            <ListItem.Subtitle>Celular: {item['Telefono']}</ListItem.Subtitle>
                                            </ListItem.Content>
                                        </ListItem>    
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </Modal>
                
            </View>
    )
}

function buildFormV3(setModalProgramVisible,data,usuario){
    
    const [tutor,setTutor] =  React.useState(null);
    const pickerRef = useRef();
    const [tutorName,setTutorName] =  React.useState(null);
    const [motivo,setMotivo] =  React.useState(null);
    const [labels, setLabels] = React.useState({});

    const url_api = "http://20.64.97.37/api/products";

    const validar = async (item) => {
        let body = rqdata.getData;
        let json = JSON.parse(body.json);
        json.Tabla = 'tutornombre';
        json.Rows = [{action:'I', Data: usuario['usukides']+'|'+tutor+'|' }];
        body.json = JSON.stringify(json);
        console.log('response',body);
        let reponse = await axios.post(`${url_api}`,body);
        if(reponse.data.Json != ''){
            let dx = JSON.parse(reponse.data.Json);
            let dx2= dx['Ftutornombre']
            console.log('response',dx);
            setTutorName(dx2[0]['Tutor'])
        }else{
            setTutorName("");
            setTutor("0");
        }

    }

    const getLabels =  async ()=>{
        var idioma = await AsyncStorage.getItem('idioma');
        const response = await _apiServices('program','','LABELS',[{action:"I",Data:"PCAMSAL|"+idioma+"|"}],{},'Mi App','0');
        console.log('bottomXXXXXXXXXXXXXXXXXXXXXXXXXXXX',response,idioma)
        if(response.length > 0){
            setLabels({...response[0]})
        }
    }
    useEffect(()=>{
        getLabels();
    },[])


    const guardar = async () => {

        if(data['Programa'] == 'PCAMBIOTUTOR'){
            if(tutor != "0"){
                let body = rqdata.getData;
                let json = JSON.parse(body.json);
                json.Tabla = 'salidatutor';
                json.Rows = [];
                for (let i = 0; i < data['alumnos'].length; i++) {
                    const element = data['alumnos'][i];
                    let l = {action:'C', Data: 'C|' + usuario['usukides']+'|'+element['idAlumno']+'|'+tutor+'|' }
                    json.Rows.push(l);
                }
                body.json = JSON.stringify(json);
                console.log('response',body);
                let reponse = await axios.post(`${url_api}`,body);
                console.log(reponse.data);
                ToastAndroid.show('Guardado Exitosamente', ToastAndroid.LONG);
                setModalProgramVisible(false)
            }else{
                ToastAndroid.show('Tutor Requerido', ToastAndroid.LONG);
            }
        }

        if(data['Programa'] == 'PTIPOSAL'){
            let body = rqdata.getData;
            let json = JSON.parse(body.json);
            json.Tabla = 'salidatipo';
            json.Rows = [];

            for (let i = 0; i < data['alumnos'].length; i++) {
                const element = data['alumnos'][i];
                let l = {action:'C', Data: 'C|' + usuario['usukides']+'|'+ element['idAlumno']+'|'+motivo+'|' }
                json.Rows.push(l);
            }
            body.json = JSON.stringify(json);
            console.log('bodyyyy', body)
            console.log('response',body);
            let reponse = await axios.post(`${url_api}`,body);
            console.log(reponse.data);
            ToastAndroid.show('Guardado Exitosamente', ToastAndroid.LONG);
            setModalProgramVisible(false)
        }

        if(data['Programa'] == 'PINASISTENCIA'){
            let body = rqdata.getData;
            let json = JSON.parse(body.json);
            json.Tabla = 'FSALIDAINASIST';
            json.Rows = [];
            for (let i = 0; i < data['alumnos'].length; i++) {
                const element = data['alumnos'][i];
                let l = {action:'C', Data: 'C|' + usuario['usukides']+'|'+element['idAlumno']+'|'+motivo+'|' }
                json.Rows.push(l);
            }
            body.json = JSON.stringify(json);
            console.log('response',body);
            let reponse = await axios.post(`${url_api}`,body);
            console.log(reponse.data);
            ToastAndroid.show('Guardado Exitosamente', ToastAndroid.LONG);
            setModalProgramVisible(false)
        }

        

    }
    

    console.log(data);
    return (
        <View>
            <ButtonGroup
            buttons={['Guardar','Cancelar','Errores']}
            selectedIndex={null}
            buttonStyle={{backgroundColor:'#E1E1E1'}}
            buttonContainerStyle={{borderColor:'gray'}}
            onPress={(value) => {
              
                if(value == 1){
                    setModalProgramVisible(false);
                }
                if(value==0){
                    guardar();
                }           

            }}
            containerStyle={{ marginBottom: 20 }}
          />
            <View style={{width:'70%',marginStart:'auto', marginEnd:'auto', marginTop:100}}>
                <Text style={{fontWeight:900}}>Nombre del Alumno:</Text>
                <Text>{data['alumnosName']?data['alumnosName']:''}</Text>

                {(data['Programa'] == 'PCAMBIOTUTOR' && (
                    <View>
                        <Text style={{fontWeight:900, marginTop:20}}>Nuevo Tutor</Text>
                        <Input value={tutor} onChangeText={(text)=> setTutor(text)}/>
                        <Button title={'Validar'} onPress={()=> validar()}/>
                        <Text style={{marginTop:30,backgroundColor:'gray', color:'white'}}>{tutorName}</Text>
                    </View>
                ))}

                {(data['Programa'] != 'PCAMBIOTUTOR' && (
                    <View>
                        <Picker
                            style={{color:'black'}}
                            selectedValue={motivo}
                            style={styles.formControlSelect}
                            onValueChange={(value)=> setMotivo(...value)}
                        >
                            
                            <Picker.Item label={'Motivos'} value={null} />
                            {(data['motivos']?data['motivos']:[]).map((item,i) => {
                                return(
                                    <Picker.Item label={item['UDDESCRIPCION']} value={item['UDCLAVE']} />
                                )
                            })}
                            
                        </Picker> 
                    </View>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    select: {
        borderBottomWidth:1,
        borderBottomColor:'gray',
        color:'black',
        margin:10,
        marginTop: 0
    },
    navBarLeftButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      flex: 1,
      paddingRight: '40px',
      textAlign: 'center',
    },
    headerTitulo:{
      textAlign: 'center',
      padding: 10,
      width:'100%',
    },
    formControl:{
      margin:0,
      padding:7,
      borderColor:'gray',
      borderRadius:5,
      borderWidth:1
    },
    formControlSelect:{
      margin:0,
      padding:7,
      color:'black',
      borderColor:'gray',
      borderRadius:5,
      borderWidth:1,
      backgroundColor:'#E1E1E1'
    }
  })



export default TutorHomeComponent;