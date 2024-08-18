import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native-web'
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';


export default function headerUser() {
 
  return (
    <View style={styles.HeaderContainer}>
      <View style={styles.BoxMiddle}>
        <View style={{ width:'30%', marginLeft:'10%'}}>
         <Image source={require('../../assets/images/LOGO.png')} style={{width:'100%', height:'100%', marginTop:3}} />
        </View>

        <View style={{width:'52%', marginLeft:'8%'}}>
            <Text style={styles.TextTitulo}>ROZCO</Text>
            <Text style={styles.TextNormal}>Online Shop</Text>
        </View>
      </View>

      <View style={styles.BoxMiddle1}>
            {/*Search Bar */}
            <View style={{
            flexDirection:'row', 
            backgroundColor:Colors.light,
            borderRadius:8,
            height:24,
            marginTop:12,
            width:'100%',
        }}>
            <AntDesign name="search1" size={17} color={Colors.primary} style={{marginLeft:'3%', marginTop:'2%'}} />
            <TextInput placeholder='Search' placeholderTextColor='#8a8a8a' style={styles.Search}></TextInput>
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    HeaderContainer: {
        marginTop:'6%',
        marginBottom:'2%',
        width:'100%',
        height:40,
        flexDirection:'row', 
    }, 

    BoxMiddle:{
        width:'45%',
        flexDirection:'row'
    },
    BoxMiddle1:{
        width:'51%',
        marginLeft:"4%"
    },
    TextTitulo:{
      fontFamily:'Poppins',
      fontWeight:'bold',
      fontSize:16
    },
    TextNormal:{
      fontFamily:'Poppins2',
      fontSize:15,
      color:'#8a8a8a'
    },

    Search:{
      fontSize:16, 
      marginLeft:'3%',
      fontFamily:'Poppins2',
      color:'#8a8a8a',
    },
  });