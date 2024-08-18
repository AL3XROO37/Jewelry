import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Mapa from './mapa2'

export default function maps() {
  return (
    <View style={{width:"100%", marginTop:20}}>
      
      <View style={{marginLeft:"10%", width:"80%"}}>
         <Text style={style.title}>Sucurzales</Text>

         <Mapa/>
      </View>
       
    </View>
  )
}

const style= StyleSheet.create({
    title:{
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
    }
})

