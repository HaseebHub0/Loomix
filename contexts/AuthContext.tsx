import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../services/firebase';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean; // Add a loading state
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  upgradeUser: () => Promise<void>;
  decrementCredits: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // User is signed in, get their profile from Firestore
        const userProfile = await authService.getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userProfile,
          });
        } else {
            // This might happen if Firestore profile creation failed during signup
            console.error("Could not find user profile for a logged in user.");
            setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    await authService.loginWithEmail(email, pass);
  }, []);

  const logout = useCallback(async () => {
    await authService.logoutUser();
    setUser(null); // Clear user state immediately
    window.location.hash = '#/login';
  }, []);

  const signup = useCallback(async (email: string, pass: string) => {
    await authService.signupWithEmail(email, pass);
  }, []);

  const upgradeUser = useCallback(async () => {
    if (user) {
      await authService.upgradeUserPlan(user.uid);
      // Optimistically update local state or refetch
      setUser(prev => prev ? { ...prev, plan: 'pro', credits: 100 } : null);
    }
  }, [user]);

  const decrementCredits = useCallback(async () => {
    if (user && user.credits > 0) {
      await authService.decrementUserCredits(user.uid);
      // Optimistically update local state
      setUser(prev => prev ? { ...prev, credits: prev.credits - 1 } : null);
    }
  }, [user]);

  if (loading) {
      return (
          <div className="flex h-screen w-full items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
      );
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      signup,
      upgradeUser,
      decrementCredits
    }}>
      {children}
    </AuthContext.Provider>
  );
};
