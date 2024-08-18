import { View, Text, Button, StyleSheet } from 'react-native';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de carpetas
import { useNavigation } from '@react-navigation/native';

export default function UserHome() {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Navega a la pantalla de inicio de sesión
      navigation.replace('SignIn');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>UserHome</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
