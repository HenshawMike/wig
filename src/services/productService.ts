import { db, storage } from '@/lib/firebase';
import { Product, ProductFormData } from '@/types/product';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc, query, where, orderBy, limit, startAfter, getDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const PRODUCTS_COLLECTION = 'products';

export const getProducts = async (filters: {
  limit?: number;
  lastVisible?: any;
  category?: string;
  featured?: boolean;
} = {}) => {
  try {
    const { limit: itemsLimit = 10, lastVisible, category, featured } = filters;
    
    let q;
    
    if (category) {
      // When filtering by category, we'll do the sorting on the client side to avoid composite index
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        limit(itemsLimit)
      );
    } else {
      // For all products, we can still sort by createdAt
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc'),
        limit(itemsLimit)
      );
      
      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }
    }
    
    if (featured !== undefined) {
      q = query(q, where('featured', '==', featured));
    }
    
    const querySnapshot = await getDocs(q);
    const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    let products = querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Product, 'id'> & {
        createdAt: any;
        updatedAt: any;
      };
      
      return {
        id: doc.id,
        name: data.name,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        featured: data.featured,
        stock: data.stock,
        // Handle both Timestamp and Date objects
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      } as Product;
    });
    
    // If we didn't sort on the server (due to category filter), sort on client
    if (filters.category) {
      products = products.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    return { products, lastVisible: lastVisibleDoc };
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      // Handle both Timestamp and Date objects
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    } as Product;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

export const createProduct = async (productData: ProductFormData): Promise<string> => {
  try {
    let imageUrl = productData.imageUrl;
    
    // Upload new image if provided
    if (productData.imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${productData.imageFile.name}`);
      await uploadBytes(storageRef, productData.imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }
    
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      imageUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<void> => {
  try {
    const updateData: any = { ...productData, updatedAt: Timestamp.now() };
    
    // Handle image upload if a new file is provided
    if (productData.imageFile) {
      // Delete old image if exists
      const oldProduct = await getProductById(id);
      if (oldProduct?.imageUrl) {
        try {
          const oldImageRef = ref(storage, oldProduct.imageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.warn('Error deleting old image:', error);
        }
      }
      
      // Upload new image
      const storageRef = ref(storage, `products/${Date.now()}_${productData.imageFile!.name}`);
      await uploadBytes(storageRef, productData.imageFile!);
      updateData.imageUrl = await getDownloadURL(storageRef);
    }
    
    // Remove imageFile from update data
    const { imageFile, ...rest } = updateData;
    
    await updateDoc(doc(db, PRODUCTS_COLLECTION, id), rest);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const getProductCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const categories = new Set<string>();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.category) {
        categories.add(data.category);
      }
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    // Delete product image from storage if exists
    const product = await getProductById(id);
    if (product?.imageUrl) {
      try {
        const imageRef = ref(storage, product.imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn('Error deleting product image:', error);
      }
    }
    
    // Delete product document
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
