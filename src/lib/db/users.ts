import { db } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';

// Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: any;
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const q = query(collection(db, USERS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as User[];
};

// Get a single user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  const docRef = doc(db, USERS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return { id: docSnap.id, ...docSnap.data() } as User;
};

// Update a user's role
export const updateUserRole = async (id: string, role: 'admin' | 'user'): Promise<void> => {
  const docRef = doc(db, USERS_COLLECTION, id);
  await updateDoc(docRef, { role });
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  const docRef = doc(db, USERS_COLLECTION, id);
  await deleteDoc(docRef);
};
