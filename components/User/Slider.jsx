import { View, Text, StyleSheet, FlatList, Image, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, auth } from '../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de carpetas
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import {Colors} from '../../constants/Colors'

export default function Slider() {
    const navigation = useNavigation();
    const [sliderList, setSliderList] = useState([]);
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        GetSliderList();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (sliderList.length > 0) {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = prevIndex + 1 >= sliderList.length ? 0 : prevIndex + 1;
                    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
                    return nextIndex;
                });
            }
        }, 3000); // Cambia cada 3 segundos

        return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonte
    }, [sliderList]);

    const GetSliderList = async () => {
        setSliderList([]);
        const q = query(collection(db, 'Slider'));
        const querySnapshot = await getDocs(q);
        const sliderData = [];
        querySnapshot.forEach((doc) => {
            sliderData.push(doc.data());
        });
        setSliderList(sliderData);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigation.replace('SignIn');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <View style={{ marginTop: 20, width: "100%" }}>
            <FlatList
                data={sliderList}
                ref={flatListRef}
                horizontal={true}
                style={{ paddingLeft: 25 }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.image }} style={style.ImageSlider} />
                )}
                keyExtractor={(item, index) => index.toString()}
                pagingEnabled // Esto asegura que se desplace de imagen en imagen
            />
          

            <TouchableOpacity style={style.addButton} onPress={handleSignOut}>
                <Text style={style.addButtonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const style = StyleSheet.create({
    ImageSlider: {
        width: 335,
        height: 160,
        borderRadius: 15,
        marginRight: 20,
    },
    addButton: {
        backgroundColor: Colors.rosaplateado,
        padding: 15,
        borderRadius: 5,
        marginLeft:"28%",
        alignItems:"center",
        width:"44%",
        marginTop:20
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
