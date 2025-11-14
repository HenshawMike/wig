import { auth, functions, db } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getCountFromServer } from 'firebase/firestore';

export const isAdmin = async (user: User): Promise<boolean> => {
  try {
    const idTokenResult = await user.getIdTokenResult();
    return idTokenResult.claims.admin === true;
  } catch (error) {
    console.error('Error verifying admin status:', error);
    return false;
  }
};

export const getUsers = async () => {
  const listUsers = httpsCallable(functions, 'listUsers');
  try {
    const result = await listUsers();
    return result.data;
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
};

export const getAnalytics = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const productsCollection = collection(db, 'products');

    const usersSnapshot = await getCountFromServer(usersCollection);
    const productsSnapshot = await getCountFromServer(productsCollection);

    return {
      totalUsers: usersSnapshot.data().count,
      totalProducts: productsSnapshot.data().count,
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    throw error;
  }
};

export const createPost = async (postData: any) => {
  try {
    await addDoc(collection(db, 'posts'), postData);
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id: string, postData: any) => {
  try {
    await updateDoc(doc(db, 'posts', id), postData);
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'posts', id));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

export const updateUser = async (uid: string, data: any) => {
  const updateUser = httpsCallable(functions, 'updateUser');
  try {
    await updateUser({ uid, ...data });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (uid: string) => {
  const deleteUser = httpsCallable(functions, 'deleteUser');
  try {
    await deleteUser({ uid });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
