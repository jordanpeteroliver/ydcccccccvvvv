// FIX: Using Firebase v9 compat imports to get the v8 namespaced API.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


// ATENÇÃO: Estes são valores de espaço reservado.
// Substitua pela configuração real do seu projeto Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

// FIX: Using Firebase v8 initialization pattern to avoid re-initialization on hot reloads.
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// FIX: Exporting auth, db, and provider using the v8 namespaced API.
export const auth = firebase.auth();
export const db = firebase.firestore();
export const provider = new firebase.auth.GoogleAuthProvider();