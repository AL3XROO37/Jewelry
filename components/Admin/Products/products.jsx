import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert, ScrollView, FlatList, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Asegúrate de que esta línea esté correcta
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../configs/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function Products() {
  const [productos, setProductos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [nombre, setNombre] = useState('');
  const [metal, setMetal] = useState('');
  const [material, setMaterial] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('');
  const [precio, setPrecio] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Lista de Productos',
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
      headerRight: () => (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('addProduct')}>
          <Ionicons name="add" size={30} style={{ color: Colors.white }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });

    fetchProductos();
    fetchBrands(); // Fetch brands when component mounts
  }, []);

  const fetchProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'product'));
      const productosList = await Promise.all(querySnapshot.docs.map(async docSnapshot => {
        const productoData = docSnapshot.data();
        const brandRef = productoData.brand;

        let brandName = '';
        if (brandRef && typeof brandRef === 'object' && brandRef.id) {
          const brandDoc = await getDoc(brandRef);
          if (brandDoc.exists()) {
            brandName = brandDoc.data().name || '';
          }
        } else {
          brandName = brandRef || '';
        }

        return {
          id: docSnapshot.id,
          ...productoData,
          brand: brandName,
        };
      }));
      setProductos(productosList);
    } catch (error) {
      console.error('Error fetching productos: ', error);
    }
  };

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

  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setNombre(producto.name);
    setMetal(producto.metal);
    setMaterial(producto.material);
    setDescripcion(producto.descripcion);
    setColor(producto.color);
    setPrecio(producto.precio.toString());
    setSelectedBrand(producto.brand); // Set the selected brand for the picker
    setModalVisible(true);
  };

  const handleSaveProducto = async () => {
    if (selectedProducto) {
      try {
        // Encuentra el nombre de la marca seleccionada
        const selectedBrandName = brands.find(brand => brand.id === selectedBrand)?.name || '';
  
        const productoDoc = doc(db, 'product', selectedProducto.id);
        await updateDoc(productoDoc, {
          name: nombre,
          metal: metal,
          material: material,
          descripcion: descripcion,
          color: color,
          precio: precio,
          brand: selectedBrandName, // Guarda el nombre de la marca en lugar del ID
        });
  
        setModalVisible(false);
        fetchProductos();
        Alert.alert('Éxito', 'Producto actualizado correctamente.');
      } catch (error) {
        console.error('Error updating producto: ', error);
        Alert.alert('Error', 'No se pudo actualizar el producto.');
      }
    }
  };
  

  const handleDeleteProducto = async (productoId) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const productoDoc = doc(db, 'product', productoId);
              await deleteDoc(productoDoc);
              fetchProductos();
            } catch (error) {
              console.error('Error deleting producto: ', error);
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.productoContainer}>
      <Image source={{ uri: item.imagen }} style={styles.productoImagen} />
      <View style={styles.productoInfo}>
        <Text style={styles.productoNombre}>{item.name}</Text>
        <Text>
          <Text style={{ fontFamily: "Poppins-regular" }}>Metal: </Text>
          <Text style={styles.productoTitulo}>{item.metal}</Text>
        </Text>
        <Text>
          <Text style={{ fontFamily: "Poppins-regular" }}>Material: </Text>
          <Text style={styles.productoTitulo}>{item.material}</Text>
        </Text>
        <Text>
          <Text style={{ fontFamily: "Poppins-regular" }}>Descripción: </Text>
          <Text style={styles.productoTitulo}>{item.descripcion.length > 50 ? `${item.descripcion.substring(0, 50)}...` : item.descripcion} </Text> 
        </Text>
        <Text>
          <Text style={{ fontFamily: "Poppins-regular" }}>Color: </Text>
          <Text style={styles.productoTitulo}>{item.color}</Text>
        </Text>
        <Text>
          <Text style={{ fontFamily: "Poppins-regular" }}>Marca: </Text>
          <Text style={styles.productoTitulo}>{item.brand}</Text>
        </Text>
        <Text style={styles.productoPrecio}>${item.precio}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEditProducto(item)} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProducto(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} style={{ color: Colors.rosaplateado }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {selectedProducto && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Editar Producto</Text>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                  style={styles.input}
                  value={nombre}
                  onChangeText={setNombre}
                  placeholder="Nombre"
                />
                <Text style={styles.label}>Metal:</Text>
                <TextInput
                  style={styles.input}
                  value={metal}
                  onChangeText={setMetal}
                  placeholder="Metal"
                />
                <Text style={styles.label}>Material:</Text>
                <TextInput
                  style={styles.input}
                  value={material}
                  onChangeText={setMaterial}
                  placeholder="Material"
                />
                <Text style={styles.label}>Descripción:</Text>
                <TextInput
                  style={styles.input}
                  value={descripcion}
                  onChangeText={setDescripcion}
                  placeholder="Descripción"
                />
                <Text style={styles.label}>Color:</Text>
                <TextInput
                  style={styles.input}
                  value={color}
                  onChangeText={setColor}
                  placeholder="Color"
                />
                <Text style={styles.label}>Precio:</Text>
                <TextInput
                  style={styles.input}
                  value={precio}
                  onChangeText={setPrecio}
                  placeholder="Precio"
                  keyboardType="numeric"
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
                <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton1} onPress={() => setModalVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleSaveProducto}>
                    <Text style={styles.modalButtonText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    marginTop: -10,
  },
  productoImagen: {
    width: 75,
    height: 75,
    borderRadius: 25,
    marginLeft: "-5%",
  },
  productoInfo: {
    flexDirection: 'column',
    width: "65%",
    marginLeft: "-3%",
    paddingTop: 15,
    paddingBottom: 15,
  },
  productoNombre: {
    fontSize: 15,
    fontFamily: "Poppins-semibold",
  },
  productoTitulo: {
    fontSize: 14,
    color: Colors.secondary,
    fontFamily: "Poppins2",
  },
  productoPrecio: {
    fontSize: 16,
    color: Colors.rosaplateado,
    fontFamily: "Poppins-medium",
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: 5,
    marginRight: 10,
  },
  deleteButton: {
    padding: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  label: {
    width: '100%',
    fontSize: 15.5,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'left',
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
    marginTop:-40
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: Colors.rosaplateado,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButton1: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    marginRight: "55%",
    justifyContent: 'center',
    alignItems: 'center',
  },
});
