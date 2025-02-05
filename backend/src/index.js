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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const alpr_1 = require("./alpr");
const db_1 = require("./db");
const storage_1 = require("./storage");
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ dest: "uploads/" });
app.post("/validar", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).json({ error: "No se subió ninguna imagen" });
        return;
    }
    try {
        // Subimos la imagen a Firebase Storage y obtenemos la URL
        const imageUrl = yield (0, storage_1.uploadImageToFirebase)(req.file.path);
        if (!imageUrl) {
            res.status(500).json({ error: "Error subiendo imagen a Firebase" });
            return;
        }
        // Detectamos la matrícula usando OpenALPR
        const matricula = yield (0, alpr_1.detectarMatricula)(req.file.path);
        if (!matricula) {
            res.json({ error: "No se detectó matrícula" });
            return;
        }
        // Verificamos si la matrícula está en Firestore
        const autorizada = yield (0, db_1.verificarMatricula)(matricula);
        res.json({
            matricula,
            estado: autorizada ? "permitido" : "denegado",
            accion: autorizada ? "abrir compuerta" : "mantener cerrada",
            imageUrl, // Devolvemos la URL de la imagen subida
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error procesando la imagen" });
    }
}));
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
