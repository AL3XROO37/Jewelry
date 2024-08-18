import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Intro from '../../components/User/ProductsDetail/Intro';
import Review from '../../components/User/ProductsDetail/Reviews';

export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productos } = route.params || {}; // Proporciona un valor predeterminado vacío si los parámetros no existen

  const [productDetail, setProductDetail] = useState(null);
  const [brandDetail, setBrandDetail] = useState(null); // Estado para almacenar los detalles de la marca
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '', // Deja el título vacío
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={30} style={{ marginRight: 25, color:"red" }} />
        </TouchableOpacity>
      ),
      headerStyle: {
        elevation: 0, // Elimina la sombra en Android
        shadowOpacity: 0, // Elimina la sombra en iOS
        borderBottomWidth: 0, // Elimina la línea en iOS
      },
    });

    GetProductsDetailById();
  }, [productos]);

  const GetProductsDetailById = async () => {
    try {
      setLoading(true); // Inicia la animación de recarga
      const docRef = doc(db, 'product', productos);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const productData = docSnap.data();
       
        setProductDetail(productData);
        setProductDetail({id:docSnap.id,...docSnap.data()})

        // Obtener los detalles de la marca si existe la referencia
        if (productData.brand) {
          const brandDoc = await getDoc(productData.brand);
          if (brandDoc.exists()) {
            setBrandDetail(brandDoc.data());
          }
        }
      } else {
        console.log("No such document!");
        setError("No such document!");
      }
    } catch (error) {
      console.error("Error getting document: ", error);
      setError("Error getting document.");
    } finally {
      setLoading(false); // Detiene la animación de recarga
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.rosaplateado} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!productDetail) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{backgroundColor:"#fff"}}>
      {/* Pasar detalles del producto y la marca al componente Intro */}
      <Intro productos={productDetail} brand={brandDetail} />

      {/*Review section*/}
      <Review  productos={productDetail} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: "Poppins-regular",
    fontSize: 18,
    color: 'red',
  },
});
