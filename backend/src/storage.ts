import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid"; // Para generar IDs únicos

// Inicializa el bucket de Firebase Storage
const bucket = admin.storage().bucket("gs://TU_PROYECTO.appspot.com");

/**
 * Sube una imagen a Firebase Storage y devuelve la URL pública.
 * @param {string} filePath - Ruta del archivo local a subir.
 * @returns {Promise<string | null>} - URL de la imagen subida o null si hay error.
 */
export const uploadImageToFirebase = async (filePath: string): Promise<string | null> => {
  try {
    const fileName = `matriculas/${uuidv4()}.jpg`;
    await bucket.upload(filePath, {
      destination: fileName,
      metadata: { contentType: "image/jpeg" },
    });

    return `https://firebasestorage.googleapis.com/v0/b/TU_PROYECTO.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;
  } catch (error) {
    console.error("Error subiendo imagen a Firebase:", error);
    return null;
  }
};
