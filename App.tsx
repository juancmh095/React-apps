/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, Icon, Tab, Text, ListItem } from '@rneui/base';
import { Input } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';


function App() {
  
  const [index, setIndex] = React.useState(0);

  
  return (
    <>
    <View>
     <Tab
      value={index}
      onChange={(e) => setIndex(e)}
      indicatorStyle={{
        backgroundColor: 'white',
        height: 3,
      }}
      variant="primary"
    >
      <Tab.Item
        title="Selec"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Buscar"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Agregar"
        titleStyle={{ fontSize: 7 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Borrar"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="Salir"
        titleStyle={{ fontSize: 8 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
    </Tab>
      <Input placeholder='Item' />
      <Input placeholder='Lote' />
      <Input placeholder='Categoria 1' />
      <Input placeholder='Categoria 2' />
      <Input placeholder='Fecha de recibo' />
      <Input placeholder='Hora de Recibo' />
        <ListItem.Swipeable
          leftContent={(reset) => (
            <Button
              title="Info"
              onPress={() => reset()}
              icon={{ name: 'info', color: 'white' }}
              buttonStyle={{ minHeight: '100%' }}
            />
          )}
          rightContent={(reset) => (
            <Button
              title="Delete"
              onPress={() => reset()}
              icon={{ name: 'delete', color: 'white' }}
              buttonStyle={{ minHeight: '100%', backgroundColor: 'red' }}
            />
          )}
        >
         
          <ListItem.Content>
            <ListItem.Title>Articulo: </ListItem.Title>
            <ListItem.Subtitle>Codigo: </ListItem.Subtitle>
            <ListItem.Subtitle>Fecha: </ListItem.Subtitle>
            <ListItem.Subtitle>Hora: </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem.Swipeable>
    </View>
    </>
  );
};



export default App;
