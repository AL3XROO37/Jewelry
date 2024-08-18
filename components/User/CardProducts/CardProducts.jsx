import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Colors } from '../../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

export default function CardProducts({ productos, brand, onProductPress}) {
  
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => onProductPress(productos)} style={styles.Container}>
        <View style={styles.Product}>
          <Image
            source={{ uri: productos.imagen }}
            style={styles.image}
          />
          <Text style={styles.title}>{productos.name}</Text>
          <Text style={styles.price}>${productos.precio}</Text>
          <Text style={styles.series}>{brand?.name || 'Marca desconocida'}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ver producto</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "50%",
    flexDirection: "row",
    marginTop: 10,
    height: 280,
  },
  Container: {
    width: "90%",
    flexDirection: "row",
    marginLeft: "2%",
  },
  Product: {
    backgroundColor: Colors.griscontenedor,
    width: "100%",
    marginRight: "6%",
  },
  image: {
    width: 150,
    height: 140,
    resizeMode: 'contain',
  },
  title: {
    height: 65,
    fontFamily: "Poppins-medium",
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 6,
    marginTop: -14,
    width: "90%",
    marginLeft: "5%",
  },
  price: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
    fontFamily: "Poppins-bold",
    width: "50%",
    marginLeft: "25%",
    textAlign: "center"
  },
  series: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
    fontFamily: "Poppins2",
    width: "90%",
    marginLeft: "10%",
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: 3,
    paddingHorizontal: 20,
    backgroundColor: Colors.rosaplateado,
  },
  buttonText: {
    fontSize: 11,
    color: 'white',
    fontFamily: "Poppins-medium"
  },
});
