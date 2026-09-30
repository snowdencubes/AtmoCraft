import { supabase } from '@/lib/supabase';

/**
 * Saves a file to Supabase Storage.
 * @param bucket The storage bucket name
 * @param key The unique key (path) to identify the file
 * @param file The file object (Blob, File)
 */
export async function saveFile(bucket: string, key: string, file: Blob | File): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(key, file, {
      upsert: true
    });

  if (error) {
    console.error('Failed to save file to Supabase:', error);
    throw error;
  }
  
  // Return public URL if bucket is public (avatars, course-covers)
  if (bucket === 'avatars' || bucket === 'course-covers') {
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(key);
    return publicUrl;
  }
  
  return data.path;
}

/**
 * Retrieves a file from Supabase Storage as a Blob.
 * @param bucket The storage bucket name
 * @param key The unique key used to save the file
 * @returns The file Blob, or undefined if not found
 */
export async function getFile(bucket: string, key: string): Promise<Blob | undefined> {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(key);
    
    if (error) {
      console.error('Failed to get file from Supabase:', error);
      return undefined;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to download file:', error);
    return undefined;
  }
}

/**
 * Retrieves a Signed URL for private buckets or Public URL for public buckets.
 */
export async function getFileUrl(bucket: string, key: string): Promise<string | null> {
  if (bucket === 'avatars' || bucket === 'course-covers') {
    const { data } = supabase.storage.from(bucket).getPublicUrl(key);
    return data.publicUrl;
  }
  
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(key, 60 * 60); // 1 hour
  if (error) return null;
  return data.signedUrl;
}

/**
 * Deletes a file from Supabase Storage.
 * @param bucket The storage bucket name
 * @param key The unique key used to save the file
 */
export async function deleteFile(bucket: string, key: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([key]);
  if (error) {
    console.error('Failed to delete file from Supabase:', error);
  }
}
