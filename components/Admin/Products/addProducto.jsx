import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../../../configs/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function AddProduct() {
  const [nombre, setNombre] = useState('');
  const [metal, setMetal] = useState('');
  const [material, setMaterial] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Añadir Producto',
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
    fetchBrands();
    // Fetch brands when component mounts
  }, []);


  const fetchBrands = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'brand'));
      const brandsList = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        name: docSnapshot.data().name,
      }));
      setBrands(brandsList);
    } catch (error) {
      console.error('Error fetching brands: ', error);
    }
  };


 
  const handleAddProduct = async () => {
    try {
      const brandRef = doc(db, 'brand', selectedBrand); // Crear la referencia al documento de la marca
  
      await addDoc(collection(db, 'product'), {
        name: nombre,
        metal: metal,
        material: material,
        descripcion: descripcion,
        color: color,
        precio: parseFloat(precio),
        imagen: imagen, // Guardar la URL de la imagen
        brand: brandRef, // Guardar la referencia al documento de la marca
      });
  
      Alert.alert('Éxito', 'Producto añadido correctamente.');
      navigation.goBack(); // Navegar de regreso a la lista de productos
    } catch (error) {
      console.error('Error adding product: ', error);
      Alert.alert('Error', 'No se pudo añadir el producto.');
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#8f8f8f"
          />
          <Text style={styles.label}>Metal:</Text>
          <TextInput
            style={styles.input}
            value={metal}
            onChangeText={setMetal}
            placeholder="Metal"
            placeholderTextColor="#8f8f8f"
          />
          <Text style={styles.label}>Material:</Text>
          <TextInput
            style={styles.input}
            value={material}
            onChangeText={setMaterial}
            placeholder="Material"
            placeholderTextColor="#8f8f8f"
          />
          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción"
            placeholderTextColor="#8f8f8f"
          />
          <Text style={styles.label}>Color:</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="Color"
            placeholderTextColor="#8f8f8f"
          />
          <Text style={styles.label}>Precio:</Text>
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            placeholder="Precio"
            placeholderTextColor="#8f8f8f"
            keyboardType="numeric"
          />
          <Text style={styles.label}>Imagen (URL):</Text>
          <TextInput
            style={styles.input}
            value={imagen}
            onChangeText={setImagen}
            placeholder="URL de la imagen"
            placeholderTextColor="#8f8f8f"
          />
          <Text style={styles.label}>Marca:</Text>
          <Picker
            selectedValue={selectedBrand}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedBrand(itemValue)}
          >
            {brands.map((brand) => (
              <Picker.Item key={brand.id} label={brand.name} value={brand.id} />
            ))}
          </Picker>
          <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    fontSize: 15.5,
    fontFamily:"Poppins-semibold",
    marginVertical: 5,
  },
  input: {
    fontFamily:"Poppins2",
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
  buttonsContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: Colors.rosaplateado, // Color del botón
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff', // Color del texto del botón
    fontSize: 16,
    fontFamily: 'Poppins-semibold',
  },
});
