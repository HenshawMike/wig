import { collection, doc, setDoc, getDoc, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  // Add any additional user fields you need
}

const USERS_COLLECTION = 'users';

/**
 * Create or update a user document in Firestore
 */
export const createOrUpdateUser = async (user: FirebaseUser, additionalData: Partial<UserData> = {}) => {
  if (!user.uid) return null;

  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const now = serverTimestamp() as any;
  
  const userData: Partial<UserData> = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    isAdmin: false, // Default to non-admin
    updatedAt: now,
    ...additionalData
  };

  // If the user doesn't exist, set created timestamp
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    userData.createdAt = now;
  }

  await setDoc(userRef, userData, { merge: true });
  return userData;
};

/**
 * Get a user document from Firestore
 */
export const getUser = async (uid: string): Promise<UserData | null> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) return null;
  
  return {
    uid: userDoc.id,
    ...userDoc.data()
  } as UserData;
};

/**
 * Update a user document
 */
export const updateUser = async (uid: string, data: Partial<UserData>) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

/**
 * Get all users (paginated)
 */
export const getUsers = async (limit = 50): Promise<UserData[]> => {
  const usersRef = collection(db, USERS_COLLECTION);
  const snapshot = await getDocs(usersRef);
  
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: data.email || '',
      displayName: data.displayName,
      photoURL: data.photoURL,
      isAdmin: data.isAdmin || false,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLoginAt: data.lastLoginAt?.toDate()
    } as UserData;
  });
};
 /* Update user's last login timestamp
 */
export const updateLastLogin = async (uid: string) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    lastLoginAt: serverTimestamp()
  });
};

export default {
  createOrUpdateUser,
  getUser,
  updateUser,
  getUsers,
  updateLastLogin
};
