import admin from "firebase-admin";
import fs from "fs";

// Cargar credenciales desde firebaseConfig.json
const serviceAccount = JSON.parse(fs.readFileSync("./src/firebaseConfig.json", "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

const db = admin.firestore();
const collection = db.collection("matriculasPermitidas");

export const verificarMatricula = async (matricula: string): Promise<boolean> => {
  try {
    const doc = await collection.doc(matricula).get();
    return doc.exists;
  } catch (error) {
    console.error("Error verificando matrícula:", error);
    return false;
  }
};
