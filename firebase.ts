// FIX: Using Firebase v9 compat imports to get the v8 namespaced API.
// FIX: Changed import to default to correctly access firebase v8 namespaced API
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

const isConfigured = firebaseConfig.apiKey !== "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" && firebaseConfig.projectId !== "your-project-id";

let auth;
let db;
let provider;

if (isConfigured) {
  // Using Firebase v8 initialization pattern to avoid re-initialization on hot reloads.
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  // Exporting auth, db, and provider using the v8 namespaced API.
  auth = firebase.auth();
  db = firebase.firestore();
  provider = new firebase.auth.GoogleAuthProvider();
} else {
  // Mock Firebase to allow app to render without a valid configuration
  console.warn("Firebase not configured. Using mock objects. Some functionality will be disabled.");
  auth = {
    onAuthStateChanged: (callback) => {
      setTimeout(() => callback(null), 0); // Simulate async check, return no user
      return () => {}; // Return unsubscribe function
    },
    signInWithPopup: () => {
      alert("Firebase não está configurado. Adicione a configuração do seu projeto Firebase em firebase.ts para habilitar a autenticação.");
      return Promise.reject("Firebase not configured");
    },
    signOut: () => Promise.resolve(),
  };

  const emptyQuerySnapshot = {
      forEach: () => {},
      docs: []
  };

  const mockCollectionRef = {
      orderBy: () => mockCollectionRef,
      onSnapshot: (callback) => {
          setTimeout(() => callback(emptyQuerySnapshot), 0);
          return () => {};
      },
      get: () => Promise.resolve(emptyQuerySnapshot),
      add: () => Promise.reject("Firebase not configured"),
      doc: () => ({
        collection: () => mockCollectionRef,
      })
  };
  
  db = {
    collection: () => mockCollectionRef,
    batch: () => ({
        delete: () => {},
        commit: () => Promise.resolve()
    })
  };

  provider = {};
}

export { auth, db, provider };
