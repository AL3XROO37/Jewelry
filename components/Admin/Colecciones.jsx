import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Colecciones() {
    // Crear una referencia para las animaciones
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const navigation = useNavigation();

    useEffect(() => {
        // Configurar la animación
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scaleAnim]);

    // Función para manejar la navegación
    const navigateToUsers = () => {
        navigation.navigate('users');
    };

    const navigateToProducts = () => {
        navigation.navigate('products');
    };

    const navigateToCategory = () => {
        navigation.navigate('users');
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.subContainer}>
                <Text style={styles.textTitle}>Colecciones</Text>

                
                <View style={styles.imageRow}>
                    <TouchableOpacity style={styles.imageBox} onPress={navigateToUsers}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <FontAwesome name="user" size={55} color={Colors.primary} />
                        </Animated.View>
                        <Text style={styles.imageText}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageBox} onPress={navigateToProducts}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <FontAwesome name="diamond" size={55} color={Colors.primary} />
                        </Animated.View>
                        <Text style={styles.imageText}>Products</Text>
                    </TouchableOpacity>
                </View>

                {/* Segunda fila de iconos */}
                <View style={styles.imageRow}>
                    <TouchableOpacity style={styles.imageBox} onPress={navigateToCategory}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Entypo name="box" size={55} color={Colors.primary} />
                        </Animated.View>
                        <Text style={styles.imageText}>Category</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imageBox}>
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <FontAwesome name="archive" size={55} color={Colors.primary} />
                        </Animated.View>
                        <Text style={styles.imageText}>Colección 4</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        marginTop: 8,
    },
    subContainer: {
        width: "80%",
        marginLeft: "10%",
    },
    textTitle: {
        fontFamily: "Poppins-bold",
        fontSize: 18,
        marginBottom: 20,
        color: Colors.rosaplateado,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },
    imageBox: {
        width: "48%", // Dos iconos por fila con un poco de espacio entre ellos
        alignItems: 'center',
    },
    imageText: {
        fontFamily: "Poppins-semibold",
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        color: Colors.secondary,
    },
});
