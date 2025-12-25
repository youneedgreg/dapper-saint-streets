import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

/**
 * Upload a single image file to Supabase storage
 * @param bucket - The storage bucket name ('product-images' or 'lookbook-images')
 * @param file - The file to upload
 * @param folder - Optional folder path within the bucket
 * @returns Promise with the public URL of the uploaded image
 */
export async function uploadImage(
  bucket: 'product-images' | 'lookbook-images',
  file: File,
  folder: string = ''
): Promise<string> {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Max file size: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${random}.${extension}`;
    
    const filepath = folder ? `${folder}/${filename}` : filename;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filepath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filepath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

/**
 * Upload multiple images to Supabase storage
 * @param bucket - The storage bucket name
 * @param files - Array of files to upload
 * @param folder - Optional folder path within the bucket
 * @returns Promise with array of public URLs
 */
export async function uploadImages(
  bucket: 'product-images' | 'lookbook-images',
  files: File[],
  folder: string = ''
): Promise<string[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(bucket, file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw error;
  }
}

/**
 * Delete an image from Supabase storage
 * @param bucket - The storage bucket name
 * @param imageUrl - The public URL of the image to delete
 */
export async function deleteImage(
  bucket: 'product-images' | 'lookbook-images',
  imageUrl: string
): Promise<void> {
  try {
    // Extract filename from URL
    const url = new URL(imageUrl);
    const pathname = url.pathname;
    // Path format: /storage/v1/object/public/bucket-name/path/to/file
    const parts = pathname.split('/');
    const filepath = parts.slice(parts.indexOf(bucket) + 1).join('/');

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filepath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Image delete error:', error);
    throw error;
  }
}

/**
 * Check if image URL is a Supabase storage URL
 */
export function isSupabaseUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('supabase.co');
  } catch {
    return false;
  }
}
