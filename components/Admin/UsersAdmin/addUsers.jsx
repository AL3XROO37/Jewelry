import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de carpetas
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import moment from 'moment'; // Asegúrate de instalar moment con `npm install moment`
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';


export default function AddUserScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Campo para la contraseña
    const [role, setRole] = useState('user'); // Default role
    const navigation = useNavigation();

    // Definir valores por defecto para la fecha y la hora
    const date = moment().format('YYYY-MM-DD');
    const time = moment().format('HH:mm');

    useEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTitle: 'Añadir Usuario',
          headerTitleStyle: {
            fontFamily: 'Poppins-semibold',
            fontSize: 18,
            color: Colors.rosaplateado,
            textAlign: 'center',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          ),
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
        });
    
        // Fetch brands when component mounts
      }, []);

    const handleAddUser = async () => {
        try {
            await addDoc(collection(db, 'user'), {
                name,
                email,
                password, // Agregar la contraseña al documento
                role,
                date,
                time,
            });
            navigation.goBack(); // Regresa a la pantalla anterior después de añadir
        } catch (error) {
            console.error('Error adding user: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Añadir Usuario</Text>
            <Text style={styles.label}>Nombre:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nombre"
            />
            <Text style={styles.label}>Email:</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
            />
            <Text style={styles.label}>Contraseña:</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry={true} // Ocultar texto de la contraseña
            />
            <Text style={styles.label}>Rol:</Text>
            <Picker
                selectedValue={role}
                style={styles.picker}
                onValueChange={(itemValue) => setRole(itemValue)}
            >
                <Picker.Item label="User" value="user" />
                <Picker.Item label="Admin" value="admin" />
            </Picker>
            <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
                <Text style={styles.addButtonText}>Añadir Usuario</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 15.5,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    picker: {
        width: '100%',
        marginTop:-40,
    },
    addButton: {
        backgroundColor: Colors.rosaplateado,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: -40,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
