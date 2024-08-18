// ProtectedRouteAdmin.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProtectedRouteAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await AsyncStorage.getItem('users');
      const user = JSON.parse(userData);

      if (user?.role === 'admin') {
        setIsAuthorized(true);
      } else {
        navigation.navigate('SignIn'); // Asegúrate de tener esta pantalla en tu navegador
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuthorized ? children : null;
};

export default ProtectedRouteAdmin;
