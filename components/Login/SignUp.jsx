// signup.jsx
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig'; // Asegúrate de ajustar la ruta a tu archivo de configuración de Firebase
import myContext from '../../app/(tabs)/myContext';
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { Colors } from "../../constants/Colors"; // Ajusta la ruta según tu estructura de archivos

const SignUp = ({ navigation }) => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;

  const [userSignup, setUserSignup] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [secureEntry, setSecureEntry] = useState(true);

  const userSignupFunction = async () => {
    if (userSignup.name === '' || userSignup.email === '' || userSignup.password === '') {
      Alert.alert('All Fields are required');
      return;
    }

    setLoading(true);
    try {
      const users = await createUserWithEmailAndPassword(auth, userSignup.email, userSignup.password);

      const user = {
        name: userSignup.name,
        email: users.user.email,
        uid: users.user.uid,
        role: userSignup.role,
        time: Timestamp.now(),
        date: new Date().toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
      };

      const userReference = collection(db, 'user');
      await addDoc(userReference, user);

      setUserSignup({
        name: '',
        email: '',
        password: '',
      });

      Alert.alert('Signup Successfully');
      setLoading(false);
      navigation.navigate('SignIn'); // Ajusta el nombre de la pantalla según tu configuración
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert('Signup Failed');
    }
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {!loading && (
        <>

          <View style={styles.textContainer}>
            <Text style={styles.headingText}>Vamos a</Text>
            <Text style={styles.headingText}>empezar</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name={"person-outline"} size={30} color={Colors.primary} />
              <TextInput
                style={styles.textInput}
                placeholder="Full Name"
                placeholderTextColor={Colors.secondary}
                value={userSignup.name}
                onChangeText={(text) => setUserSignup({ ...userSignup, name: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name={"mail-outline"} size={30} color={Colors.primary} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor={Colors.secondary}
                value={userSignup.email}
                onChangeText={(text) => setUserSignup({ ...userSignup, email: text })}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputContainer}>
              <SimpleLineIcons name={"lock"} size={30} color={Colors.primary} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={Colors.secondary}
                value={userSignup.password}
                onChangeText={(text) => setUserSignup({ ...userSignup, password: text })}
                secureTextEntry={secureEntry}
              />
              <TouchableOpacity onPress={() => setSecureEntry(!secureEntry)}>
              <SimpleLineIcons name={"eye"} size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.signupButtonWrapper} onPress={userSignupFunction}>
              <Text style={styles.signupText}>Sign up</Text>
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
              <Text style={styles.accountText}>Already have an account!</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

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
    alignContent:"center",
    alignItems:"center"
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
  signupButtonWrapper: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    marginTop: 20,
  },
  signupText: {
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
    borderColor: Colors.primary,
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
  loginLink: {
    color: Colors.primary,
    fontFamily: 'Poppins-bold',
    fontWeight:'bold'
  },
});

export default SignUp;
