import React, { useEffect, useRef, useState } from "react";
import { ListItem } from '@rneui/base';
import { Avatar, Button, ButtonGroup, Icon, Image, Input, Text } from "react-native-elements";
import axios from "axios";
import { Picker } from '@react-native-picker/picker';
import { Formik } from "formik";
import { ScrollView, View, Modal, ToastAndroid, Linking, StyleSheet } from "react-native";
import * as rqdata from '../../components/tools/params_request';
import storage from "../../services/Storage";
import HomeComponent from '../../../components/App.tsx';
import ModuleComponent from '../../../components/Module.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MaestroHomeComponent = ({navigation}) => {
    const formikRef = useRef();
    const [usuario, setUsuario] = React.useState(null);
    
    const [btnBNames, setBtnBNames] = React.useState([]);
    const [btnBCode, setBtnBCode] = React.useState([]);

    const [acordion, setAcordion] = React.useState([]);
    const [dataChecks, setDataChecks] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [modalProgramVisible, setModalProgramVisible] = React.useState(false);
    const [modalProgramVisible2, setModalProgramVisible2] = React.useState(false);
    const [modalVisible3, setModalVisible3] = React.useState(false);
    const [modalVisible4, setModalVisible4] = React.useState(false);
    const [params_view, setParams_view] = React.useState(null);

    var url_api = "";
    
    useEffect(() => {
        
        validateUser();
        return () => {
            return;
        }
    }, []);

    const validateUser = async () => {
        var url = await AsyncStorage.getItem('api');
        url_api = url;

        storage.getAllDataForKey('FUSERSLOGIN').then(res => {
            setUsuario(res[0]);
            if(url_api != null){
                load_form_inputs(res[0]);
                showBarraBottom();
            }
        });
    }

    const showBarraBottom = async () => {

        var url = await AsyncStorage.getItem('api');
        url_api = url;

        let body = rqdata.labels;
        let json = JSON.parse(body.json);
        json.Tabla = 'BARRAPROGRAM';
        let row = json.Rows;

        let r = '0|PMENUS|';
        row[0]['Data'] = r;
        json.Rows = row;
        body.json = JSON.stringify(json);
        console.log(body)
        var reponse = await axios.post(`${url_api}`,body);
        console.log('bottom Bar',reponse.data,body);
        if(reponse.data.Json != ''){
            console.log('------>',reponse.data.Json)
            let datx = JSON.parse(reponse.data.Json);
            let datxx = datx['FBARRAPROGRAM'];
            console.log(datxx);
            if(btnBNames.length < datxx.length){
                for (let i = 0; i < datxx.length; i++) {
                    const element = datxx[i];
                    btnBNames.push(element['OPTITULO'])
                    btnBCode.push(element['OPOBNMOPC']);                
                }
                setBtnBCode([...btnBCode]);
                setBtnBNames([...btnBNames]);
            }
        }
    }

    const load_form_inputs = async (userx) => {

        var url = await AsyncStorage.getItem('api');
        url_api = url;

        var usukides = userx['usukides']
        var usukiduser = userx['usukiduser']
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
            }



            console.log(menuItems);

            setAcordion(menuItems);
        }
    }  

    const showProgram = async (item) => {
        try {
            var url = await AsyncStorage.getItem('api');
        url_api = url;
        var model = {};
        var usukides = usuario['usukides'];

        
        console.log(item)
        if(item.Programa == 'PDIA'){
            let grukidgr = item['grukidgr'];
            let body = rqdata.getData;
            let json = JSON.parse(body.json);
            let row = json.Rows;
            let r = usukides + '|' +grukidgr + '|';
            row[0]['Data'] = r;
            json.Rows = row;
            body.json = JSON.stringify(json);
            console.log('response',body);
            let reponse = await axios.post(`${url_api}`,body);
            if(reponse.data.Json != ''){
                var datx = JSON.parse(reponse.data.Json);
                
                var chks = [];
                if(datx['Fregasistencia']){
                    for (let index = 0; index   < datx['Fregasistencia'].length; index++) {
                        chks.push(true);
                    }
                }

                setDataChecks(chks);

                model = {
                    usukides:usukides,
                    grukidgr: grukidgr,
                    opcion: item['Opcion'],
                    list: datx['Fregasistencia']?datx['Fregasistencia']:[],
                    item:item,
                    checks:chks
                }
                console.log('Model',model)
                setData(model); 
            }
            setModalProgramVisible(true);
        }else{
            console.log(item)
            if(item.Programa == 'PSALIDA'){
                /* obtener titulos */
                let body = rqdata.labels;
                let json = JSON.parse(body.json);
                json.Tabla = 'INQBARRASALIDA';
                let row = json.Rows;
                
                let r = '0|'+usuario['usidioma']+'|';
                row[0]['Data'] = r;
                json.Rows = row;
                body.json = JSON.stringify(json);
                var reponse = await axios.post(`${url_api}`,body);
                if(reponse.data.Json != ''){
                    let datx = JSON.parse(reponse.data.Json);
                    var optiomsbar = [];
                    for (let i = 0; i < datx['FINQBARRASALIDA'].length; i++) {
                        const element = datx['FINQBARRASALIDA'][i];
                        optiomsbar.push(element['Titulo'])
                        
                    }
                    console.log('btnx->',optiomsbar);

                    console.log('____________________carga__________________');
                    let body = rqdata.labels;
                    let json = JSON.parse(body.json);
                    json.Tabla = 'SALIDAINQAPP';
                    let row = json.Rows;

                    let r = usuario['usukides'] + '|0|5|A|';
                    row[0]['Data'] = r;
                    row[0]['Action'] = 'I';
                    json.Rows = row;
                    body.json = JSON.stringify(json);
                    var reponse = await axios.post(`${url_api}`,body);
                    console.log(reponse.data);
                    var datxa = [];
                    if(reponse.data.Json != ''){
                        datxa = JSON.parse(reponse.data.Json);
                        
                    }

                    var bodyN = rqdata.getCarga('NIVELINQ','I','2|0|');
                    var responseN = await axios.post(`${url_api}`,bodyN);
                    console.log('XXXXXXXXXXXXXXXXXX',responseN.data);
                    var niveles = [];
                    if(responseN.data.Json != ''){
                        let nvl = JSON.parse(responseN.data.Json);
                        niveles = nvl['FNIVELINQ'];
                    }
                    
                    let model = {
                        bar: optiomsbar,
                        opcion: 'x Primaria 5A x',
                        list: datxa['FSALIDAINQAPP']?datxa['FSALIDAINQAPP']:[],
                        niveles: niveles
                    }
                    setData(model);
                    setModalProgramVisible2(true);
                }
            }
        }
            
        } catch (error) {
            console.log('error',error);
        }
        
    }

    const goTo = async (programa) => {

        var url = await AsyncStorage.getItem('api');
        url_api = url;
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
    
  return (
    <View style={{backgroundColor:'white', height:'100%'}}>
         <ScrollView>
            <View>
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

                                                                if(option['Programa'] == 'PDIA'){
                                                                    showProgram(option)
                                                                }
                                                                if(option['Programa'] == 'PSALIDA'){
                                                                    let model = {
                                                                        Programa: option['Programa'],
                                                                        name: option['Opcion']
                                                                    }
                                                    
                                                                    showProgram(model);
                                                                }
                                                                console.log(option)
                                                                if(option['Programa'] == 'PLOTE' || option['Programa'] == 'PREPORTS' || option['Programa'] == 'PJOBS' || option['Programa'] == 'PCARGAMASIVA' || option['Programa'] == 'PCOMPRAS'){
                                                                    goTo(option['Programa'])
                                                                }
                                                            }}>
                                                            <ListItem.Content>
                                                                <ListItem.Title>{option.Opcion}</ListItem.Title>
                                                            </ListItem.Content>
                                                            <ListItem.Chevron />
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
         <ButtonGroup
            buttons={btnBNames}
            selectedIndex={null}
            buttonStyle={{backgroundColor:'#E1E1E1'}}
            buttonContainerStyle={{borderColor:'gray'}}
            onPress={(value) => {
              
                let model = {
                    Programa: btnBCode[value],
                    name: btnBNames[value]
                }

                showProgram(model);
            

            }}
            containerStyle={{ marginBottom: 20 }}
          />
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
                <View style={{width:300, marginStart:'auto', marginEnd:'auto'}}>
                    <Picker
                        style={{color:'black'}}
                        onValueChange={(value) => console.log(value)}
                        style={styles.formControlSelect}
                    >
                        {(data.niveles?data.niveles:[]).map((item) => {
                            return(
                                <Picker.Item label={item.ESDESCRIPCION} value={item.ESNIVEL} />
                            )
                        })}
                    </Picker> 
                    <Input 
                        placeholder={'Tipo Sal.'} 
                        style={styles.formControl}
                        containerStyle={{margin:0, padding:0, height:50}}
                        inputContainerStyle={{borderBottomWidth:0}}
                        onChangeText={(value)=> console.log(value)}
                    />
                    <Input 
                        placeholder={'Grado'} 
                        style={styles.formControl}
                        containerStyle={{margin:0, padding:0, height:50}}
                        inputContainerStyle={{borderBottomWidth:0}}
                        onChangeText={(value)=> console.log(value)}
                    />
                    <Input 
                        placeholder={'Grupo'} 
                        style={styles.formControl}
                        containerStyle={{margin:0, padding:0, height:50}}
                        inputContainerStyle={{borderBottomWidth:0}}
                        onChangeText={(value)=> console.log(value)}
                    />
                    

                </View>

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
                                      onPress={()=> { 
                                        if(alumno?.idAlumno == item.idAlumno){
                                            setAlumno({})
                                        }else{
                                            setAlumno(item); 
                                        }
                                    }}
                                >
                                    <ListItem.Content style={(item.idAlumno == alumno?.idAlumno)?{backgroundColor:"#dad8d8"}:''}>
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


export default MaestroHomeComponent;