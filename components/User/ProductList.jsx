import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import { collection, getDocs, query, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import ProductContainer from './ProductContainer';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState({});

    useEffect(() => {
        GetProductList();
    }, []);

    const GetProductList = async () => {
        try {
            const q = query(collection(db, 'product'));
            const querySnapshot = await getDocs(q);
            const productsList = [];
            const brandsData = {};

            // Primero, obtenemos todos los productos
            querySnapshot.forEach(async (doc) => {
                const product = doc.data();
                productsList.push({ id: doc.id, ...product });
              //setProducts(prev=>[...prev,{id:doc.id,...doc.data()}]) //esto agrege NSDJNJSD

                // Si hay una referencia a la marca, obtenemos sus datos
                if (product.brand) {
                    const brandDoc = await getDoc(product.brand);
                    if (brandDoc.exists()) {
                        brandsData[doc.id] = brandDoc.data();
                    }
                }
            });

            // Esperamos a que todas las solicitudes de marca se completen
            await Promise.all(querySnapshot.docs.map(doc => {
                const product = doc.data();
                if (product.brand) {
                    return getDoc(product.brand).then(brandDoc => {
                        if (brandDoc.exists()) {
                            brandsData[doc.id] = brandDoc.data();
                        }
                    });
                }
                return Promise.resolve();
            }));

            setProducts(productsList);
            setBrands(brandsData);

        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Popular</Text>
                <Text style={styles.viewAllText}>View All</Text>
            </View>

            <FlatList
                data={products}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <ProductContainer product={item} brand={brands[item.id]} key={index} />
                )}
                contentContainerStyle={styles.mainContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginLeft: "7%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "85%"
    },
    headerText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
    },
    viewAllText: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.rosaplateado
    },
    mainContainer: {
        paddingHorizontal: "7%",
        paddingVertical: 10,
    }
});
