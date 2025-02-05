"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToFirebase = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const uuid_1 = require("uuid"); // Para generar IDs únicos
// Inicializa el bucket de Firebase Storage
const bucket = firebase_admin_1.default.storage().bucket("gs://TU_PROYECTO.appspot.com");
/**
 * Sube una imagen a Firebase Storage y devuelve la URL pública.
 * @param {string} filePath - Ruta del archivo local a subir.
 * @returns {Promise<string | null>} - URL de la imagen subida o null si hay error.
 */
const uploadImageToFirebase = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = `matriculas/${(0, uuid_1.v4)()}.jpg`;
        yield bucket.upload(filePath, {
            destination: fileName,
            metadata: { contentType: "image/jpeg" },
        });
        return `https://firebasestorage.googleapis.com/v0/b/TU_PROYECTO.appspot.com/o/${encodeURIComponent(fileName)}?alt=media`;
    }
    catch (error) {
        console.error("Error subiendo imagen a Firebase:", error);
        return null;
    }
});
exports.uploadImageToFirebase = uploadImageToFirebase;
