"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config'; 

// Define the shape of the context data
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// Create the provider component that will wrap our app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily use the auth context in other components
export const useAuth = () => {
  return useContext(AuthContext);
};