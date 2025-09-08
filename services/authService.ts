import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '../types';

// Creates a new user in Firebase Auth and a corresponding document in Firestore
export const signupWithEmail = async (email: string, password: string): Promise<void> => {
    try {
        console.log('Creating user with email:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created successfully, UID:', user.uid);
        
        try {
            // Create a user profile document in Firestore
            console.log('Creating Firestore profile for user:', user.uid);
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                credits: 5,
                plan: 'free',
            });
            console.log('Firestore profile created successfully');
        } catch (firestoreError) {
            console.error("Failed to create Firestore profile:", firestoreError);
            // If creating the profile fails, delete the user from Auth to prevent orphaned accounts
            if (auth.currentUser && auth.currentUser.uid === user.uid) {
                await deleteUser(auth.currentUser);
            }
            // Re-throw a more user-friendly error
            throw new Error(`Failed to create your user profile: ${firestoreError.message}`);
        }
    } catch (error) {
        console.error("Signup failed:", error);
        throw error;
    }
};

// Signs in a user with Firebase Auth
export const loginWithEmail = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
};

// Signs out the current user
export const logoutUser = async (): Promise<void> => {
    await signOut(auth);
};

// Retrieves a user's profile from Firestore
export const getUserProfile = async (uid: string): Promise<Omit<User, 'uid' | 'email'> | null> => {
    try {
        console.log('Attempting to get user profile for UID:', uid);
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            console.log('User profile retrieved successfully:', data);
            return {
                credits: data.credits,
                plan: data.plan
            };
        } else {
            console.warn("No user profile found in Firestore for UID:", uid);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user profile from Firestore:', error);
        throw new Error(`Failed to retrieve user profile: ${error.message}`);
    }
};

// Upgrades a user's plan to 'pro' in Firestore
export const upgradeUserPlan = async (uid: string): Promise<void> => {
    try {
        console.log('Upgrading user plan for UID:', uid);
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            plan: 'pro',
            credits: 100
        });
        console.log('User plan upgraded successfully');
    } catch (error) {
        console.error('Error upgrading user plan:', error);
        throw new Error(`Failed to upgrade user plan: ${error.message}`);
    }
};

// Decrements a user's credits in Firestore
export const decrementUserCredits = async (uid: string): Promise<void> => {
    try {
        console.log('Decrementing credits for UID:', uid);
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            credits: increment(-1)
        });
        console.log('Credits decremented successfully');
    } catch (error) {
        console.error('Error decrementing user credits:', error);
        throw new Error(`Failed to decrement credits: ${error.message}`);
    }
};