import React from 'react';
// FIX: Removed unused v9 auth imports as we now use methods on the auth object.
// import { signInWithPopup, signOut } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { auth, provider } from '../firebase';
import { GoogleIcon } from './Icons';

export const Auth: React.FC = () => {
    const { user, isLoading } = useAuth();

    const handleLogin = async () => {
        try {
            // FIX: Using the signInWithPopup method from the v8 auth service object.
            await auth.signInWithPopup(provider);
        } catch (error) {
            console.error("Authentication failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            // FIX: Using the signOut method from the v8 auth service object.
            await auth.signOut();
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    if (isLoading) {
        return <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>;
    }

    if (user) {
        return (
            <div className="flex items-center gap-3">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName || user.email}`} 
                  alt={user.displayName || 'User'} 
                  className="w-10 h-10 rounded-full border-2 border-red-500/80"
                  title={user.displayName || user.email || 'Usuário'}
                />
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-red-500/20 dark:hover:bg-red-600 text-gray-800 dark:text-white rounded-md transition-colors duration-300"
                >
                    Sair
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 border border-gray-200"
        >
            <GoogleIcon className="w-5 h-5" />
            <span>Entrar com Google</span>
        </button>
    );
};