import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements';

import  TopbarModule  from '../components/topbar';
import  ButtomBarModule  from '../components/buttomBar';
import  FormsComponent  from '../components/forms';
import { Formik } from 'formik';

const ProgramPage = (props) => {

    const formikRef = useRef();

    return (
        <View style={{width:'100%',height:'100%'}}>
            <View>
                <TopbarModule />
            </View>
            <Text>Hola</Text>
            <View>
                <Formik
                initialValues={{}}
                key={'form1'}
                onSubmit={values => console.log(values)}
                innerRef={formikRef}
                
                >
                {({ handleChange, setFieldValue, handleSubmit, values }) => (

                    <FormsComponent 
                        program="PLOTE" 
                        item="MC0001"
                        handleChange = {handleChange}
                        setFieldValue = {setFieldValue}
                        handleSubmit = {handleSubmit}
                        values = {values}
                    />

                )}
                </Formik>
            </View>
            <View style={styles.fixedButton}>
                <ButtomBarModule />
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
      }
})

export default ProgramPage