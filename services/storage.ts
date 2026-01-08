import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Uploads a user profile image to Firebase Storage.
 * @param userId - The user's ID
 * @param uri - The local URI of the image to upload
 * @returns The download URL of the uploaded image
 */
export const uploadProfileImage = async (userId: string, uri: string): Promise<string> => {
  try {
    // Use XMLHttpRequest for better React Native compatibility
    const blob = await new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error("XHR Error:", e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // Generate a unique filename using timestamp
    const filename = `profiles/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, blob);
    // @ts-ignore
    blob.close(); // Free up memory
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};
