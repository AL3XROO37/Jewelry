import { View, Text, StyleSheet, FlatList, Image, Button, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, auth } from '../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de carpetas
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Admin/headerAdmi';
import Slider from '../../components/User/Slider';
import Colecciones from '../../components/Admin/Colecciones'

export default function homeAdmin() {
    const navigation = useNavigation();

  

    return (
        <ScrollView style={{ backgroundColor: "white" }}>

            <Header />
            {/* Slider */}
            <Slider />

            <Colecciones/>
           
        </ScrollView>
    );
}

const style = StyleSheet.create({
    textSpecial: {
        fontFamily: 'Poppins-bold',
        fontSize: 16,
        paddingLeft: 20,
        paddingTop: 20,
        marginBottom: 5,
    },
    ImageSlider: {
        width: 325,
        height: 160,
        borderRadius: 15,
        marginRight: 20,
    },
});
