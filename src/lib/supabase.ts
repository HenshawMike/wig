import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cookie settings for development
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const cookieOptions = {
  name: 'sb-auth-token',
  lifetime: 60 * 60 * 24 * 7, // 7 days
  domain: isLocalhost ? 'localhost' : window.location.hostname,
  path: '/',
  sameSite: 'Lax',
};

// Initialize Supabase client with storage options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'sb-auth-token',
    storage: {
      getItem: (key) => {
        const item = document.cookie.split('; ').find(row => row.startsWith(`${key}=`));
        return item ? item.split('=')[1] : null;
      },
      setItem: (key, value) => {
        document.cookie = `${key}=${value}; path=/; max-age=604800; samesite=lax${isLocalhost ? '' : '; secure'}`;
      },
      removeItem: (key) => {
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      },
    },
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  },
});

// Set the storage endpoint
const STORAGE_BUCKET = 'products';

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param path - The path in the storage bucket (e.g., 'images')
 * @returns Promise with the public URL of the uploaded file
 */
export async function uploadFile(file: File, path: string): Promise<{ path: string; url: string }> {
  try {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    // 1. First upload the file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // 2. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    console.log('File uploaded successfully:', {
      path: filePath,
      publicUrl,
    });

    return {
      path: filePath,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param filePath - The full path or URL of the file to delete
 * @returns Promise with success/error status
 */
export async function deleteFile(filePath: string): Promise<{ error: Error | null }> {
  try {
    // Extract the path from URL if it's a full URL
    let pathToDelete = filePath;
    const urlMatch = filePath.match(/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
    if (urlMatch) {
      pathToDelete = urlMatch[1];
    }

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([pathToDelete]);

    if (error) {
      console.error('Delete error:', error);
      return { error };
    }

    console.log('File deleted successfully:', pathToDelete);
    return { error: null };
  } catch (error) {
    console.error('Error in deleteFile:', error);
    return { error: error as Error };
  }
}
