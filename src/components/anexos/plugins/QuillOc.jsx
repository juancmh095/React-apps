import React, {useEffect, useRef, useState} from "react";
import {Animated, BackHandler, StyleSheet, ToastAndroid, View} from 'react-native'
import QuillEditor, {QuillToolbar} from "react-native-cn-quill";
import axios from "axios";
import { Button } from "react-native-elements";


import  buffer from 'buffer';
import AsyncStorage from "@react-native-async-storage/async-storage";

import  {default as _apiServices} from '../../tools/api';


const QuillComponent = ({setModalVisible, setTextBase64, req}) => {

    const _editor = useRef()
    const isIphone = true    
    const _api = 'http://20.64.97.37/api/products';
    const [text, setText] = React.useState(null);
    const animatedValues = {
        width: useRef(new Animated.Value(0)).current,
        height: useRef(new Animated.Value(0)).current,
    }

    const {width, height} = animatedValues

    const handleAnimated = () => {
        Animated.sequence([
            Animated.spring(width, {
                toValue: 1,
                friction: 8,
                useNativeDriver: false
            }),
            Animated.spring(height, {
                toValue: 1,
                friction: 8,
                useNativeDriver: false
            })
        ]).start(({finished}) => {
            
        })
    }

    const toolBarStyle = {
        width: width.interpolate({
            inputRange: [0, 1],
            outputRange: ['30%', '100%'],
            extrapolate: 'clamp'
        })
    }

    const quillEditorStyle = {
        height: height.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp'
        })
    }

    useEffect(() => {
        handleAnimated();
    });

  
    const SendQuill = async () => {
        let encodeTxt = new buffer.Buffer(text.html).toString("base64");

        setTextBase64(encodeTxt);
        setModalVisible(false);
    }

    const showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
      };

    return(
        <View style={{height: 'auto', alignSelf: 'stretch'}}>
            <View style={{height: '80%', marginTop:50, width: '100%'}}>
                
                <Animated.View style={[styles.quillbar, toolBarStyle]}>
                    <QuillToolbar editor={_editor} options={'full'} theme={'light'}/>
                </Animated.View>


                <Animated.View style={[{alignSelf: 'stretch'}, quillEditorStyle]}>
                    <QuillEditor
                        ref={_editor}
                        webview={{
                            scrollEnabled: true,
                            style: {borderWidth: isIphone ? 1.8 : 0, borderColor: '#dadada'},
                            nestedScrollEnabled: true,
                            showsHorizontalScrollIndicator: false,
                            showsVerticalScrollIndicator: false
                        }}
                        quill={{theme: 'bubble', placeholder: '¿Qué estás pensando?'}}
                        container={isIphone ? false : true}
                        onHtmlChange={(e) => setText(e)}
                        initialHtml=""
                        
                    />

                </Animated.View>
            </View>

            <Button
                title="Enviar"
                onPress={()=> SendQuill()}
            ></Button>
        </View>
    )
}

const styles = StyleSheet.create({
    quillbar: {
        height: 36,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    buttonContainer: {
        height: 37,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        backgroundColor: '#0068C5'
    },
    buttonTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#fff'
    }
})

export default QuillComponent;