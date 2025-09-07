import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// FIX: The v9 modular imports for auth were causing errors.
// import { User, onAuthStateChanged } from 'firebase/auth';
// FIX: Import firebase/compat/app to use the v8 compat User type.
// FIX: Changed to default import and added auth compat for side-effects to fix firebase.User type.
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../firebase';

interface AuthContextType {
  // FIX: Using the Firebase v8 compat User type.
  user: firebase.User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // FIX: Using the Firebase v8 compat User type.
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // FIX: Using the onAuthStateChanged method from the v8 auth service object.
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { user, isLoading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
