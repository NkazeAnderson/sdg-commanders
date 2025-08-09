import { storageBuckets } from "@/constants";
import { decode } from "base64-arraybuffer";
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from "expo-image-picker";
import { supabase } from ".";

/**
 * Reads a file from a given URI and returns its base64-encoded string.
 * @param uri The file URI from Expo ImagePicker.
 * @returns The base64 string of the file contents.
 */
export async function getBase64FromUri(uri: string): Promise<string> {
    return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
}


/**
 * Uploads a base64-encoded image to the 'public-images' bucket in Supabase Storage.
 * @param asset The base64-encoded image string (data URL or raw base64).
 * @param fileName The name to save the file as (e.g., 'image.png').
 * @returns The public URL of the uploaded image or an error.
 */
export async function uploadBase64ImageToSupabase(
    asset: ImagePickerAsset
): Promise<string> {
    const userRes = await supabase.auth.getUser()
  if ( !userRes.data.user?.id) {
    throw new Error("Base 64 required or unauthenticanted");
  }
  const fileName = `${userRes.data.user.id}/${new Date().getTime()}_${asset.fileName ?? "file"}.${asset.mimeType?.split("/")[1]}`
   const base64 = await getBase64FromUri(asset.uri)
    const { error } = await supabase.storage
        .from(storageBuckets.public)
        .upload(fileName, decode(base64), {
            contentType: asset.mimeType,
            upsert: true,
        });

    if (error) {
        throw new Error("Failed to upload");
        ;
    }
    const { data:{publicUrl} } = supabase.storage.from(storageBuckets.public).getPublicUrl(fileName);
    return publicUrl 
}