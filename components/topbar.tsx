import React from 'react';
import { View } from 'react-native';
import * as _apiServices from './tools/api'

const topbar = (props) => {

    var icons = 
    { 
        1:'check',
        2:'search',
        3:'add',
        4:'close'
    }
    var iconsColor = 
    {
        1:'green',
        2:'blue',
        3:'green',
        4:'red'
    }
    const [buttons, setButtons] = useState([]);

    useEffect(() => {
        // Función para obtener los botones desde la API
        const fetchButtons = async () => {
          try {
            const response = await _apiServices();
            const data = await response.json();
            setButtons(data.buttons); // Asumiendo que la respuesta tiene un array de botones en 'data.buttons'
          } catch (error) {
            console.error('Error fetching buttons:', error);
          }
        };
    
        fetchButtons();
      }, []);

    return (
        <View>

        </View>
    )
}

