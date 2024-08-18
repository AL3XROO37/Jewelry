

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig'; // Ajusta la ruta según tu estructura de archivos
import myContext from '../../app/(tabs)/myContext'; // Ajusta la ruta según tu estructura de archivos
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from "../../constants/Colors"; // Ajusta la ruta según tu estructura de archivos

const SignIn = () => {
  const navigation = useNavigation();
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  });

  const [secureEntery, setSecureEntery] = useState(true);

  const userLoginFunction = async () => {
    if (userLogin.email === '' || userLogin.password === '') {
      Alert.alert('All Fields are required');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
      const q = query(
        collection(db, 'user'),
        where('uid', '==', userCredential.user.uid)
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let user;
        querySnapshot.forEach((doc) => {
          user = doc.data();
        });
        setUserLogin({
          email: '',
          password: ''
        });
        setLoading(false);
        if (user.role === 'user') {
          navigation.navigate('homeUser'); // Asegúrate de tener esta pantalla en tu navegador
        } else {
          navigation.navigate('homeAdmin'); // Asegúrate de tener esta pantalla en tu navegador
        }
      });

      return () => unsubscribe(); // Clean up subscription on unmount

    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Login Failed');
    }
  };

  const handleSignup = () => {
    navigation.navigate("SIGNUP");
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row", marginLeft:10}}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>Bienvenido</Text>
          <Text style={styles.headingText}>de Vuelta</Text>
        </View>
        <View style={{margin:35, marginRight:10}}>
          <Image
            source={require("../../assets/images/LOGO.png")}
            style={styles.LOGO}
          />
        </View>
      </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && (
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name={"mail-outline"} size={30} color={Colors.primary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={Colors.secondary}
              keyboardType="email-address"
              value={userLogin.email}
              onChangeText={(text) => setUserLogin({ ...userLogin, email: text })}
            />
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={30} color={Colors.primary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={Colors.secondary}
              secureTextEntry={secureEntery}
              value={userLogin.password}
              onChangeText={(text) => setUserLogin({ ...userLogin, password: text })}
            />
            <TouchableOpacity onPress={() => setSecureEntery((prev) => !prev)}>
              <SimpleLineIcons name={"eye"} size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={userLoginFunction}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.continueText}>or continue with</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText} >Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: Colors.primary,
    fontFamily: 'Poppins-bold',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: 'Poppins',
  },
  loginButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Poppins',
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    fontFamily: 'Poppins',
    color: Colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: Colors.secondary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  LOGO: {
    height: 100,
    width: 100,
    marginTop:5
  },
  googleText: {
    fontSize: 20,
    fontFamily: 'Poppins',
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: Colors.primary,
    fontFamily: 'Poppins',
  },
  signupText: {
    color: Colors.primary,
    fontFamily: 'Poppins-bold',
    fontWeight:'bold'
  },
});
