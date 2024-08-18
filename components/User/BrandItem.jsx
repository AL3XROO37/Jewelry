import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
export default function BrandItem({ category, onCategoryPress }) {
    return (
        <TouchableOpacity onPress={() => onCategoryPress(category)} >

        <View style={{padding:10, marginRight:5, borderRadius:99}}>
            <Image source={{uri:category.icon}}
            style={{width:61, height:70}}
            />
        </View> 
            <View style={{ padding: 15, marginTop:-15}}>
                <Text style={styles.tab}>{category.name}</Text>
            </View>
        </TouchableOpacity >
    )


}


const styles = StyleSheet.create({

    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 10,
    },
    tab: {
        fontFamily: 'Poppins2',
        fontSize: 10,
        color: Colors.primary,
        textAlign: 'center'
    },

});


