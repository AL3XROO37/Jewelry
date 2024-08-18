// App.js
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { MyProvider } from './myContext';
import SignIn from '../../components/Login/SignIn'; // Ajusta la ruta según tu estructura de carpetas
import Signup from '../../components/Login/SignUp';// Ajusta la ruta según tu estructura de carpetas
import UserDashboard from '../../components/User/UserHome'; // Ajusta la ruta según tu estructura de carpetas
import Maps from '../../components/User/Map/maps'
import users from '../../components/Admin/UsersAdmin/users';
import products from '../../components/Admin/Products/products';
import AddUser from '../../components/Admin/UsersAdmin/addUsers'
import addProduct from '../../components/Admin/Products/addProducto'
import ProductListCategory from '../productList/[category]';
import ProductDetail from '../productDetail/[productid]'
import homeUser from './homeUser';
import homeAdmin from './homeAdmin';
import { auth, db } from '../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de carpetas
import { useFonts } from "expo-font";
import category from '../../components/Admin/Category/category'; 

const Stack = createStackNavigator();

export default function App() {
  useFonts({
    'Poppins': require('../../assets/fonts/Poppins-Thin.ttf'),
    'Poppins2': require('../../assets/fonts/Poppins-Light.ttf'),
    'Poppins-bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-semibold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-medium': require('../../assets/fonts/Poppins-Medium.ttf'),
  })

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user role from Firestore and set it
        try {
          const q = query(
            collection(db, 'user'),
            where('uid', '==', user.uid)
          );
          const querySnapshot = await getDocs(q);
          let userData;
          querySnapshot.forEach((doc) => {
            userData = doc.data();
          });
          setUser(user);
          setRole(userData.role);
        } catch (error) {
          console.error("Error fetching user role: ", error);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }



  return (
    <MyProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user && role === 'user' ? 'homeUser' : user && role === 'admin' ? 'homeAdmin' : 'SignIn'}>

          <Stack.Screen name="SignIn" options={{ headerShown: false }} component={SignIn} />
          <Stack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
          {user && role === 'user' && (
            <>
              <Stack.Screen name="homeUser" options={{ headerShown: false }} component={homeUser} />
              <Stack.Screen name="ProductListCategory" options={{ headerShown: false }} component={ProductListCategory} />
              <Stack.Screen name="ProductDetail" options={{ headerShown: false }} component={ProductDetail} />
              <Stack.Screen name="Maps" options={{ headerShown: false }} component={Maps} />
            </>
          )}
          {user && role === 'admin' && (
            <>
              <Stack.Screen name="homeAdmin" options={{ headerShown: false }} component={homeAdmin} />
              <Stack.Screen name="users" options={{headerShown:false}} component={users} />
              <Stack.Screen name="AddUser" options={{headerShown:false}} component={AddUser} />
              <Stack.Screen name="products" options={{headerShown:false}}  component={products} />
              <Stack.Screen name="addProduct" options={{headerShown:false}}  component={addProduct} />
              <Stack.Screen name="category"  component={category} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </MyProvider>
  );
}
