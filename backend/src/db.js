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
exports.verificarMatricula = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fs_1 = __importDefault(require("fs"));
// Cargar credenciales desde firebaseConfig.json
const serviceAccount = JSON.parse(fs_1.default.readFileSync("./firebaseConfig.json", "utf-8"));
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
const db = firebase_admin_1.default.firestore();
const collection = db.collection("matriculasPermitidas");
const verificarMatricula = (matricula) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doc = yield collection.doc(matricula).get();
        return doc.exists;
    }
    catch (error) {
        console.error("Error verificando matrícula:", error);
        return false;
    }
});
exports.verificarMatricula = verificarMatricula;
