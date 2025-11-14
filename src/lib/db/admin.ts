import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ADMINS_COLLECTION = 'admins';

export const updateAdminProfile = async (id: string, data: { name: string; email: string }) => {
  const docRef = doc(db, ADMINS_COLLECTION, id);
  await updateDoc(docRef, data);
};
