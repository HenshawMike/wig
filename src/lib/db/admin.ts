import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';

const ADMIN_COLLECTION = 'admins';

// Check if a user is an admin
export const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, ADMIN_COLLECTION, uid));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Add a user as an admin
export const addAdmin = async (uid: string, email: string) => {
  try {
    await setDoc(doc(db, ADMIN_COLLECTION, uid), {
      email,
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error adding admin:', error);
    return false;
  }
};

// Remove admin privileges from a user
export const removeAdmin = async (uid: string) => {
  try {
    await deleteDoc(doc(db, ADMIN_COLLECTION, uid));
    return true;
  } catch (error) {
    console.error('Error removing admin:', error);
    return false;
  }
};

// Create a new admin user with email and password
export const createAdminUser = async (email: string, password: string) => {
  try {
    // Create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Add user to admins collection
    await addAdmin(user.uid, email);
    
    // Sign out the admin user (for security)
    await signOut(auth);
    
    return { success: true, userId: user.uid };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // If user exists, just make them an admin
      try {
        // Try to sign in to get the user
        const signInResult = await signInWithEmailAndPassword(auth, email, password);
        await addAdmin(signInResult.user.uid, email);
        await signOut(auth);
        return { success: true, userId: signInResult.user.uid };
      } catch (signInError) {
        console.error('Error signing in existing user:', signInError);
        return { success: false, error: 'Failed to sign in existing user' };
      }
    }
    console.error('Error creating admin user:', error);
    return { success: false, error: error.message };
  }
};
