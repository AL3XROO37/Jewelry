import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React from 'react'
import { Colors } from '../../../constants/Colors'

export default function Intro({ productos, brand }) {
  return (
    <View style={{ backgroundColor: "#fff" }}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productos.imagen }}
            style={styles.image}
          />
          <View style={styles.sombreado}>
            <Text style={styles.text}>{productos.name}</Text>
            <Text style={styles.textRight}>${productos.precio}</Text>
          </View>
        </View>

        <View style={styles.ContainDescrip}>
          <Text style={{ fontFamily: "Poppins-semibold", fontSize: 16, color: Colors.oroPlateado }}>Descripción</Text>
          <Text style={styles.TextDesc}>{productos.descripcion}</Text>
        </View>

        <View style={styles.ContainInfo}>
          <View style={styles.subcontainInfo}>
            <Text style={styles.subtitleinfo}>Metal</Text>
            <Text style={styles.textinfo}>{productos.metal}</Text>
          </View>

          <View style={styles.subcontainInfo}>
            <Text style={styles.subtitleinfo2}>Categoría</Text>
            <Text style={styles.textinfo2}>{brand.name}</Text>
          </View>
        </View>

        <View style={styles.ContainInfo}>
          <View style={styles.subcontainInfo}>
            <Text style={styles.subtitleinfo}>Material</Text>
            <Text style={styles.textinfo}>{productos.material}</Text>
          </View>

          <View style={styles.subcontainInfo}>
            <Text style={styles.subtitleinfo2}>Color</Text>
            <Text style={styles.textinfo2}>{productos.color}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    marginTop: -1,
  },
  imageContainer: {
    position: 'relative',
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%"
  },
  sombreado: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    color: '#fff',
    width: "47%",
    fontFamily: 'Poppins-medium',
    marginLeft: "7%",
    fontSize: 14.5
  },
  textRight: {
    color: '#fff',
    textAlign: 'right',
    width: "33%",
    fontFamily: 'Poppins-semibold',
    marginRight: "7%",
    fontSize: 18
  },
  ContainDescrip: {
    width: "80%",
    marginLeft: "10%",
    marginTop: 20,
  },
  TextDesc: {
    fontFamily: "Poppins2",
    fontSize: 12.5,
    textAlign: "justify",
    color: Colors.secondary
  },
  ContainInfo: {
    width: "72%",
    marginLeft: "13%",
    marginTop: 20,
    flexDirection: 'row', // Alineación horizontal de los subcontendores
    justifyContent: 'space-between',
  },
  subcontainInfo: {
    width: "48%", // Ajustar el ancho para que los elementos encajen en una fila
  },
  subtitleinfo: {
    fontFamily: 'Poppins-semibold',
    marginBottom: 4, // Añadir un pequeño espacio entre el título y la información
    fontSize: 14.5,
    color: Colors.oroPlateado,
  },
  textinfo: {
    fontFamily: "Poppins2",
    fontSize: 13,
    color: Colors.secondary,
  },
  subtitleinfo2:{
    fontFamily: 'Poppins-semibold',
    marginBottom: 4, // Añadir un pequeño espacio entre el título y la información
    fontSize: 14.5,
    color: Colors.oroPlateado,
    marginLeft:"13%",
  },
  textinfo2:{
    fontFamily: "Poppins2",
    fontSize: 13,
    color: Colors.secondary,
    marginLeft:"13%"
  }
})
