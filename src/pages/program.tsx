import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-elements';

import  TopbarModule  from '../components/topbar';
import  ButtomBarModule  from '../components/buttomBar';
import  FormsComponent  from '../components/forms';
import  ListDataModule  from '../components/listData';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';

import  {default as _apiServices} from '../components/tools/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@rneui/base';
import { NavigationContext } from '@react-navigation/native';



const ProgramPage = (props) => {

    /* CONVERSIONTO:VERSION, OPFORMA:FORMA, Programa */
    const [programs1, setPrograms1] = React.useState([]);
    const [idP1, setIdP1] = React.useState('');
    const [programs2, setPrograms2] = React.useState([]);
    const [listData, setListData] = React.useState([]);
    const [listDataSelect, setListDataSelect] = React.useState({});
    const [pSelect, setPSelect] = React.useState({});
    const navigation = React.useContext(NavigationContext);
    const formikRef = useRef();

    const getDataPrograms = async () => {
        var idioma:any = await AsyncStorage.getItem('idioma');
        const response1 = await _apiServices('program','','ProgramHeader',[{action:"I",Data:props['Programa']+'|'+props['OPFORMA']+'|F|'+idioma+'|'}],{},'Mi App','0');
        setPrograms1([...response1]);
        const response2 = await _apiServices('program','','ProgramRow',[{action:"I",Data:props['Programa']+'|'+props['OPFORMA']+'|R|'+idioma+'|'}],{},'Mi App','0');
        setPrograms1([...response2]);
    }

    const getParamsProgram = () => {

        if(props['Params']){
            let params = props['Params'];
            let paramsArr = params.split('@');
            for (let i = 0; i < paramsArr.length; i++) {
                const element = paramsArr[i];
                let item = element.split(':');

                const regex = /[,]/gm;
                const subst = '';
                const str = item[1]?item[1]:'';
                const result = str.replace(regex, subst);

                formikRef.current.setFieldValue(item[0],result);
            }
        }
    }

    const selectProgram = (program) => {
        setPSelect({...program});
    }

    const gotoProgram = async () => {
        const paramsProgram = await _apiServices('program','','INTERCONECT',[{action:"I",Data:props['Programa']+'|'+props['OPFORMA']+'|'+pSelect['COOBNMOPC']+'|'+pSelect['COFORMATO']+'||'}],{},'Mi App','0');
       
        let campos = '';
        for (let index = 0; index < paramsProgram.length; index++) {
            const element = paramsProgram[index];
            if(index == 0){
                campos = campos + '@' + element['PPCAMPOTO'] + ':' + listDataSelect[element['PPCAMPOFROM']];
            }else{
                campos = campos + ',@' + element['PPCAMPOTO'] + ':' + listDataSelect[element['PPCAMPOFROM']];
            }
        }
        let dataProgram = {
            COVERSIONTO:pSelect['COVERSIONTO'], 
            OPFORMA:pSelect['COFORMATO'], 
            Programa:pSelect['COOBNMOPC'],
            Params:campos, 
            OPMESSAGE:pSelect['COMESSAGE'], 
            'Opcion':pSelect['COTITULO'], 
            dataSelect:listDataSelect,
            COTIPO:pSelect['COTIPO'],
            BACKPROGRAM: props['Programa'],
            BACKFORMA: props['OPFORMA']
        }
        //console.log(dataProgram);
        navigation.push('Program',dataProgram)
    }

    useEffect(()=> {
        getDataPrograms();
        getParamsProgram();  
        navigation.setOptions({ title: props['Opcion'] });      
    },[])

    return (
        <View style={{width:'100%',height:'100%'}}>
            <View>
                <TopbarModule form={formikRef} data={props} setListData={setListData} listDataSelect={listDataSelect} TipoAcceso={props['TipoAcceso']}/>
            </View>
            <View>
                {(programs1.length > 0 && props['TIPO'] == null && (
                    <View style={styles.row}>
                        <Picker
                            style={{color:'black'}}
                            style={styles.formControlSelect}
                            selectedValue={idP1}
                            onValueChange={(value,index)=>{
                                setIdP1(value);
                                setPSelect({...programs1[index-1]})
                            }}
                        >
                            <Picker.Item label={'...'} value={''} />
                            {programs1.map((item) => {
                                return(
                                    <Picker.Item label={item.COTITULO} value={item['COOBNMOPC']} />
                                )
                            })}
                            
                        </Picker> 
                        <Button type="outline" containerStyle={{width:'10%', marginEnd:30, marginStart:0}} style={{margin:0}}
                            onPress={()=> gotoProgram()}
                        >
                            <Icon name='arrow-right-circle' type='material-community' />
                        </Button>
                    </View>
                ))}
            </View>
            <ScrollView>
                <View>
                    <Formik
                    initialValues={{}}
                    key={'form1'}
                    onSubmit={values => console.log(values)}
                    innerRef={formikRef}
                    
                    >
                    {({ handleChange, setFieldValue, handleSubmit, values }) => (

                        <FormsComponent 
                            program={props['Programa']} 
                            OPFORMA={props['OPFORMA']} 
                            item={props['COVERSIONTO']}
                            handleChange = {handleChange}
                            setFieldValue = {setFieldValue}
                            handleSubmit = {handleSubmit}
                            form = {formikRef}
                            values = {values}
                        />

                    )}
                    </Formik>
                </View>
                <View>
                    {( programs2.length > 0 && props['TIPO'] == null && (
                        <Picker
                            style={{color:'black'}}
                            style={styles.formControlSelect}
                            onValueChange={(value)=>console.log(value)}
                        >
                            {programs2.map((item) => {
                                return(
                                    <Picker.Item label={item.COTITULO} value={item.COMESSAGE} />
                                )
                            })}
                            
                        </Picker> 

                    ))}
                </View>
                <View>
                    <ListDataModule Programa={props['Programa']} dataList={listData} OPFORMA={props['OPFORMA']} Params={props['Params']} setListDataSelect={setListDataSelect} />
                </View>
            </ScrollView>
            <View style={styles.fixedButton}>
                <ButtomBarModule program={props['Programa']} OPFORMA={props['OPFORMA']} listDataSelect={listDataSelect} TipoAcceso={props['TipoAcceso']} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    fixedButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
      },
      formControlSelect:{
        marginStart:10,
        marginEnd:0,
        padding:7,
        color:'black',
        borderColor:'gray',
        borderRadius:10,
        width:'80%',
        borderWidth:1,
        backgroundColor:'#E1E1E1'
      },
      row: {
        flexDirection: 'row',  // Alinea los elementos horizontalmente
        alignItems: 'center',  // Alinea verticalmente al centro
        justifyContent: 'space-between',  // Espacio entre los elementos
      },
})

export default ProgramPage