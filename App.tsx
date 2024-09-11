import { ActivityIndicator, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Icon, Input, Text } from "react-native-elements";
import axios from "axios";
import { Formik } from "formik";
import Navigation from './src/services/Navigation';

const App = () => {
    
    const [textinit, setExtInit] = React.useState('Bienvenido');
   
 
  return (
    <Navigation />
    
  );
}




export default App;