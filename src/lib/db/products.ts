import { db, storage } from '../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const PRODUCTS_COLLECTION = 'products';

// Types
export interface Product {
  id?: string;
  name: string;
  price: number; // Price in kobo (1 Naira = 100 kobo) for precision
  category: string;
  stock: number;
  description: string;
  imageUrl: string;
  createdAt?: any;
  updatedAt?: any;
}

// Format price in Naira
export const formatPrice = (priceInKobo: number): string => {
  // Convert kobo to Naira and format with 2 decimal places
  const priceInNaira = (priceInKobo / 100).toFixed(2);
  return `₦${priceInNaira.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// Convert Naira to kobo for storage
export const toKobo = (naira: number): number => {
  return Math.round(naira * 100);
};

// Convert kobo to Naira for display
export const toNaira = (kobo: number): number => {
  return kobo / 100;
};

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  const q = query(collection(db, PRODUCTS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

// Get a single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return { id: docSnap.id, ...docSnap.data() } as Product;
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile?: File): Promise<string> => {
  let imageUrl = product.imageUrl || '';
  
  // Upload image if provided
  if (imageFile) {
    const storageRef = ref(storage, `products/${uuidv4()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }
  
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
};

// Update a product
export const updateProduct = async (id: string, product: Partial<Product>, imageFile?: File): Promise<void> => {
  const updateData: any = {
    ...product,
    updatedAt: serverTimestamp(),
  };
  
  // Handle image upload if new image is provided
  if (imageFile) {
    // Delete old image if exists
    const oldProduct = await getProductById(id);
    if (oldProduct?.imageUrl) {
      const oldImageRef = ref(storage, oldProduct.imageUrl);
      await deleteObject(oldImageRef).catch(console.error);
    }
    
    // Upload new image
    const storageRef = ref(storage, `products/${uuidv4()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    updateData.imageUrl = await getDownloadURL(storageRef);
  }
  
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, updateData);
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  // Delete image from storage if exists
  const product = await getProductById(id);
  if (product?.imageUrl) {
    const imageRef = ref(storage, product.imageUrl);
    await deleteObject(imageRef).catch(console.error);
  }
  
  // Delete document
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const q = query(
    collection(db, PRODUCTS_COLLECTION), 
    where('category', '==', category),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  const q = query(
    collection(db, PRODUCTS_COLLECTION), 
    where('featured', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};
