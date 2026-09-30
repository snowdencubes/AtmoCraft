import { set, get, del } from 'idb-keyval';

/**
 * Saves a file to IndexedDB.
 * @param key The unique key to identify the file
 * @param file The file object (Blob, File, or base64 string)
 */
export async function saveFile(key: string, file: Blob | string): Promise<void> {
  try {
    await set(key, file);
  } catch (error) {
    console.error('Failed to save file to IndexedDB:', error);
    // Fallback to localStorage if idb fails (e.g. string size within limits)
    if (typeof file === 'string') {
      try {
        localStorage.setItem(`file_${key}`, file);
      } catch (e) {
        console.error('Failed to save file to localStorage fallback:', e);
      }
    }
  }
}

/**
 * Retrieves a file from IndexedDB.
 * @param key The unique key used to save the file
 * @returns The file object, or undefined if not found
 */
export async function getFile(key: string): Promise<Blob | string | undefined> {
  try {
    const file = await get(key);
    if (file !== undefined) {
      return file;
    }
    
    // Check fallback
    const fallback = localStorage.getItem(`file_${key}`);
    if (fallback) {
      return fallback;
    }
    
    return undefined;
  } catch (error) {
    console.error('Failed to get file from IndexedDB:', error);
    const fallback = localStorage.getItem(`file_${key}`);
    if (fallback) {
      return fallback;
    }
    return undefined;
  }
}

/**
 * Deletes a file from IndexedDB.
 * @param key The unique key used to save the file
 */
export async function deleteFile(key: string): Promise<void> {
  try {
    await del(key);
    localStorage.removeItem(`file_${key}`);
  } catch (error) {
    console.error('Failed to delete file from IndexedDB:', error);
    localStorage.removeItem(`file_${key}`);
  }
}
