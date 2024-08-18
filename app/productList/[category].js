import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import CardProducts from '../../components/User/CardProducts/CardProducts';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProductListCategory() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params || {}; // Proporciona un valor predeterminado vacío si los parámetros no existen

  const [products, setProductsList] = useState([]);
  const [brands, setBrands] = useState({});
  const [brandDetails, setBrandDetails] = useState(null); // Estado para almacenar los detalles de la marca
  const [loading, setLoading] = useState(true); // Estado para gestionar la animación de recarga
  const [refreshing, setRefreshing] = useState(false); // Estado para gestionar el pull-to-refresh

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: category,
      headerTitleStyle: {
        color: Colors.primary,
        fontFamily: "Poppins-bold",
        fontSize: 20
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 15 }} />
        </TouchableOpacity>
      ),
    });

    GetProductsList();
  }, [category]);

  const GetProductsList = async () => {
    try {
      setLoading(true); // Inicia la animación de recarga
      // Primero obtenemos todas las marcas que coinciden con la categoría
      const brandQuery = query(collection(db, 'brand'), where("name", '==', category));
      const brandSnapshot = await getDocs(brandQuery);
      if (brandSnapshot.empty) {
        setProductsList([]);
        setLoading(false); // Detiene la animación de recarga
        return;
      }

      // Tomamos el primer documento de marca (puedes ajustar esto si esperas más de una coincidencia)
      const brandDoc = brandSnapshot.docs[0];
      const brandRef = brandDoc.ref;
      const brandData = brandDoc.data(); // Obtén los datos de la marca

      // Luego obtenemos los productos que tienen la referencia de marca
      const productQuery = query(collection(db, 'product'), where("brand", '==', brandRef));
      const productSnapshot = await getDocs(productQuery);
      const productsList = [];
      const brandsData = {};
      

      // Obtenemos todos los productos y resolvemos las referencias de marca
      for (const doc of productSnapshot.docs) {
        const product = doc.data();
        productsList.push({ id: doc.id, ...product });

        if (product.brand) {
          const brandDoc = await getDoc(product.brand);
          if (brandDoc.exists()) {
            brandsData[doc.id] = brandDoc.data();
          }
        }
      }

      setProductsList(productsList);
      setBrands(brandsData);
      setBrandDetails(brandData); // Guarda los detalles de la marca en el estado
    } catch (error) {
      console.error("Error getting documents: ", error);
    } finally {
      setLoading(false); // Detiene la animación de recarga
      setRefreshing(false); // Detiene el pull-to-refresh
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    GetProductsList();
  };

  const renderItem = ({ item }) => (
    <CardProducts
      productos={item}
      key={item.id}
      brand={brands[item.id]} // Pasar datos de marca si es necesario
      onProductPress={() => navigation.navigate('ProductDetail', { productos: item.id })}
    />
  );

  const renderHeader = () => (
    <View>
      <Text style={{ marginLeft: 10, marginTop: 20, color: Colors.rosaplateado, fontFamily: "Poppins-medium", fontSize: 18 }}>Descripción</Text>
      <View style={styles.ContainerDesc}>
        <View style={styles.imgDescrip}>
          {brandDetails && (
            <Image
              source={{ uri: brandDetails.icon }} // Utiliza el campo de la URL de la imagen desde la base de datos
              style={styles.image}
            />
          )}
        </View>
        <View style={styles.descrip}>
          {brandDetails && (
            <Text style={styles.textdesc}>
              {brandDetails.descripcion} {/* Utiliza el campo de descripción desde la base de datos */}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.rosaplateado} />
        </View>
      )}
      <FlatList
        data={products}
        renderItem={renderItem}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.mainContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  mainContainer: {
    paddingHorizontal: '7%',
    paddingVertical: 10,
  },
  ContainerDesc: {
    width: "100%",
    flexDirection: "row",
    marginTop: 17, 
  },
  imgDescrip: {
    width: "40%",
  },
  image: {
    width: "100%",
    height: 100,
    marginLeft: "10%",
    marginTop: 5
  },
  descrip: {
    width: "53%",
    marginLeft:"4%",
  },
  textdesc: {
    fontFamily: "Poppins2",
    fontSize: 9,
    textAlign: "center"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});
