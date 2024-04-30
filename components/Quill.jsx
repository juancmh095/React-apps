import {useEffect, useRef, useState} from "react";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import QuillEditor, {QuillToolbar} from "react-native-cn-quill";

const QuillComponent = () => {

    const _editor = useRef()
    const isIphone = true    

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

    return(
        <View style={{height: 'auto', alignSelf: 'stretch'}}>
            <View style={{height: 175, marginTop:50, width: '100%'}}>
                
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
                        onHtmlChange={(e) => console.log(e)}
                        initialHtml=""
                    />

                </Animated.View>
            </View>
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