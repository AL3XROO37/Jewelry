// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2EtFDaJ8ZmiPfBSGkkbPo0e9WaBpmkXw",
  authDomain: "community-marketplace-256f1.firebaseapp.com",
  projectId: "community-marketplace-256f1",
  storageBucket: "community-marketplace-256f1.appspot.com",
  messagingSenderId: "66066585334",
  appId: "1:66066585334:web:7a209171a9956b52283ed7",
  measurementId: "G-4PRWEF0D5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db };
