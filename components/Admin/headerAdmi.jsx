import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Colors } from '../../constants/Colors';

export default function HeaderUser() {
  return (
    <View style={styles.HeaderContainer}>
      <View style={styles.BoxMiddle}>
        <View style={{ width: '30%', marginLeft: '10%' }}>
          <Image source={require('../../assets/images/LOGO.png')} style={{ width: '100%', height: '100%', marginTop: 3 }} />
        </View>

        <View style={{ width: '52%', marginLeft: '8%' }}>
          <Text style={styles.TextTitulo}>ROZCO</Text>
          <Text style={styles.TextNormal}>Online Shop</Text>
        </View>
      </View>

      <View style={styles.BoxMiddle1}>
        <Text style={styles.TextTitulo2}>ADMIN</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  HeaderContainer: {
    marginTop: '6%',
    marginBottom: '2%',
    width: '100%',
    height: 40,
    flexDirection: 'row',
  },
  BoxMiddle: {
    width: '45%',
    flexDirection: 'row',
  },
  BoxMiddle1: {
    width: '51%',
    marginLeft: '4%',
    alignItems: 'center',         // Centra horizontalmente
    justifyContent: 'center',     // Centra verticalmente
  },
  TextTitulo: {
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    fontSize: 16,
  },
  TextTitulo2: {
    fontFamily: 'Poppins',
    fontWeight: 'bold',
    fontSize: 22,
    color:Colors.rosaplateado,
  },
  TextNormal: {
    fontFamily: 'Poppins2',
    fontSize: 15,
    color: '#8a8a8a',
  },
  Search: {
    fontSize: 16,
    marginLeft: '3%',
    fontFamily: 'Poppins2',
    color: '#8a8a8a',
  },
});
