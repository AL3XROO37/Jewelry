import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../configs/FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const navigation = useNavigation();
  
  const handleAddUserPress = () => {
    navigation.navigate('AddUser'); // Navega a la nueva pantalla de añadir usuario
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Lista de Usuarios',
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
        <TouchableOpacity style={{ width: 45, height: 45, borderRadius: 25, backgroundColor: Colors.primary, marginRight: "55%" }} onPress={handleAddUserPress}>
          <Ionicons name="add" size={30} style={{ color: Colors.white, marginLeft: 7, marginTop: 7 }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
      },
    });

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'user'));
      const usersList = [];

      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        usersList.push({
          id: doc.id,
          ...userData,
        });
      });

      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setModalVisible(true);
  };

  const handleSaveUser = async () => {
    if (selectedUser) {
      try {
        const userDoc = doc(db, 'user', selectedUser.id);
        await updateDoc(userDoc, {
          name: name,
          email: email,
          role: role,
        });
  
        setModalVisible(false);
        fetchUsers();
        Alert.alert('Éxito', 'Usuario actualizado correctamente.');
      } catch (error) {
        console.error('Error updating user: ', error);
        Alert.alert('Error', 'No se pudo actualizar el usuario.');
      }
    }
  };
  

  const handleDeleteUser = async (userId) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este usuario?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const userDoc = doc(db, 'user', userId);
              await deleteDoc(userDoc);
              fetchUsers();
            } catch (error) {
              console.error('Error deleting user: ', error);
              Alert.alert('Error', 'No se pudo eliminar el usuario.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleRoleChange = (event) => {
    setRole(event.nativeEvent.value);
  };

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userRole}>Rol: {item.role}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleEditUser(item)} style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} style={{color:Colors.rosaplateado}} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {selectedUser && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Editar Usuario</Text>
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

              <Text style={styles.label}>Rol:</Text>
              <SegmentedControl
                values={['user', 'admin']}
                selectedIndex={role === 'admin' ? 1 : 0}
                onChange={handleRoleChange}
                style={styles.segmentedControl}
              />

              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                <Button title="Guardar" onPress={handleSaveUser} />
              </View>
            </View>
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
  userContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  userRole: {
    fontSize: 14,
    color: '#888',
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
  segmentedControl: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: Colors.primary
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});
