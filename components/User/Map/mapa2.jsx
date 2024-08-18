import React, { useRef } from 'react';
import { View, Button, TouchableOpacity, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {Colors} from '../../../constants/Colors'

const Maps = () => {
  // Coordenadas del establecimiento
  const establishmentLocation = {
    latitude: 19.432608,
    longitude: -99.133209,
    name: "Mi Joyería",
    address: "Calle Falsa 123, Ciudad, País",
  };

  // Referencia al MapView
  const mapRef = useRef(null);

  // Función para centrar el mapa en la ubicación del establecimiento
  const centerMap = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: establishmentLocation.latitude,
        longitude: establishmentLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000); // Duración de la animación en milisegundos
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, borderWidth: 1, width: "80%", height: 250, marginLeft: "10%", marginBottom:50, marginTop:20 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: establishmentLocation.latitude,
            longitude: establishmentLocation.longitude,
            latitudeDelta: 0.005, // Ajusta el zoom según tus necesidades
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{ latitude: establishmentLocation.latitude, longitude: establishmentLocation.longitude }}
            title={establishmentLocation.name}
            description={establishmentLocation.address}
          />
        </MapView>
      </View>

      <TouchableOpacity style={style.addButton} onPress={centerMap}>
       
        <Text style={style.addButtonText}>Centrar en Mi Joyería</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Maps;

const style= StyleSheet.create({
  addButton: {
    backgroundColor: Colors.rosaplateado,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: -30,
    marginBottom:40
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
})



