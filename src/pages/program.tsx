import React from 'react';
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-elements';

import  TopbarModule  from '../components/topbar';
import  ButtomBarModule  from '../components/buttomBar';

const ProgramPage = (props) => {



    return (
        <View style={{width:'100%',height:'100%'}}>
            <View>
                <TopbarModule />
            </View>
            <Text>Hola</Text>

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