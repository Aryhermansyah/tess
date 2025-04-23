import { supabase } from './supabaseClient';

/**
 * Upload file (image) to Supabase Storage and return the public URL.
 * @param bucket string - bucket name (e.g. 'images')
 * @param file File | Blob | string (base64)
 * @param fileName string - unique file name (e.g. `${Date.now()}_photo.jpg`)
 * @returns publicUrl or null
 */
export async function uploadImageToSupabase(bucket: string, file: File | Blob | string, fileName: string): Promise<string | null> {
  let fileData: File | Blob;
  if (typeof file === 'string') {
    // Assume base64 string
    const arr = file.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    fileData = new Blob([u8arr], { type: mime });
  } else {
    fileData = file;
  }
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage.from(bucket).upload(fileName, fileData, { upsert: true });
  if (error) {
    console.error('Upload error:', error.message);
    return null;
  }
  // Get public URL
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData?.publicUrl || null;
}
