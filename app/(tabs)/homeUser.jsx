import { ScrollView, ScrollViewBase, View } from 'react-native';
import React from 'react';
import Header from '../../components/User/headerUser';
import Slider from '../../components/User/Slider';
import MiddlePart from '../../components/User/MiddlePart';
import ProductList from '../../components/User/ProductList';
import Maps from '../../components/User/Map/maps';
export default function homeUser() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff"}}>
      
        {/* Header */}
        <Header />
        {/* Slider */}
        <Slider />
        {/* Middle Part */}
        <MiddlePart />
        {/* Product List */}
        <ProductList />

        <Maps />
         
    </ScrollView>
  );
}
