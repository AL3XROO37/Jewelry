import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth } from '../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de carpetas
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../../constants/Colors';
import { collection, doc, getDocs, query } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de carpetas
import BrandItem from './BrandItem';
import { useNavigation } from '@react-navigation/native';

export default function MiddlePart() {
    const [userName, setUserName] = useState('');

    const [brandList, SetBrandList] = useState([]);

    const navigation = useNavigation();

    useEffect(() => {
        fetchUserEmail();
        GetBrandList();
    }, []);

    const fetchUserEmail = () => {
        const user = auth.currentUser;
        if (user) {
            const email = user.email;
            if (email) {
                // Extrae la parte antes del primer punto y convierte a mayúsculas
                const firstName = email.split('@')[0].split('.')[0].toUpperCase();
                setUserName(firstName);
            }
        } else {
            console.log('No user is signed in');
        }
    };

    const GetBrandList = async () => {
        SetBrandList([])
        const q = query(collection(db, 'brand'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {

            SetBrandList(prev => [...prev, doc.data()])
        })
    };

    return (
        <View>
            <View style={styles.WelcomeHader}>
                <View style={styles.LeftPart}>
                    <Text style={styles.textTitle}>Welcome Back,</Text>
                    <View style={styles.textContainer}>
                        <Text style={[styles.textTitle, { color:Colors.rosaplateado }]}>{userName}!</Text>
                        <MaterialIcons name="waving-hand" size={24} color={Colors.grisPlateado} />
                    </View>
                    <Text style={styles.textligth}>Obten un descuento en todos los articulos ahora</Text>
                </View>

                <View style={styles.RightPart}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={{ uri: 'https://th.bing.com/th/id/R.847c3d3b960b202e1e8bbb3d1da28359?rik=4TrvzV1KDvPX3Q&pid=ImgRaw&r=0' }}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.separator} />

            <View style={{ marginLeft: "7%", display: "flex", flexDirection: "row", justifyContent: "space-between", width: "85%", }}>
                <Text style={{ fontFamily: 'Poppins-bold', fontSize: 16, }}>Category</Text>
                <Text style={{ fontSize: 15, fontFamily: "Poppins-semibold", color: Colors.rosaplateado }}>View All</Text>
            </View>
            <FlatList
                data={brandList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={{ marginLeft: 10 }}
                renderItem={({ item, index }) => (
                    <BrandItem category={item} key={index} onCategoryPress={() => navigation.navigate('ProductListCategory', { category: item.name })} />
                    
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    WelcomeHader: {
        width: "100%",
        flexDirection: "row",
        marginTop: 10,
    },
    LeftPart: {
        width: "53%",
        marginLeft: "7%",
    },
    textContainer: {
        flexDirection: 'row', // Alinea los elementos en una fila
        justifyContent: 'space-between', // Espacia los elementos a lo largo del eje principal
        alignItems: 'center', // Alinea los elementos a lo largo del eje transversal
        marginTop: -6
    },
    textTitle: {
        fontFamily: "Poppins-medium",
        fontSize: 25,
    },
    RightPart: {
        width: '40%',
        height: 100,
        justifyContent: 'center',  // Centra verticalmente el contenido 
        alignItems: 'center', // Centra horizontalmente el contenido
    },
    avatarContainer: {
        width: 83,
        height: 83,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.grisPlateado,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    textligth: {
        fontFamily: 'Poppins2',
        fontSize: 13,
        color: '#8a8a8a'
    },
    separator: {
        height: 1,
        backgroundColor: Colors.grisPlateado, // Cambia el color según tu diseño
        marginVertical: 8, // Espaciado vertical alrededor de la línea
        width: "85%",
        marginLeft: "7%"
    },

    tabs: {

        marginVertical: 10,
    },
    tab: {
        fontFamily: 'Poppins2',
        fontSize: 10,
        color: '#8a8a8a'
    },
});
