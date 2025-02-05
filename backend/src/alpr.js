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
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectarMatricula = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
// Convierte exec en una función basada en promesas
const execPromise = (0, util_1.promisify)(child_process_1.exec);
/**
 * Detecta la matrícula de un vehículo en una imagen utilizando OpenALPR dentro de un contenedor Docker.
 *
 * @param {string} imagePath - Ruta de la imagen a analizar.
 * @returns {Promise<string | null>} - La matrícula detectada o null si no se encuentra ninguna.
 */
const detectarMatricula = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        // Ejecuta el comando OpenALPR dentro del contenedor Docker "alpr"
        const { stdout } = yield execPromise(`docker exec alpr alpr -j ${imagePath}`);
        // Convierte la salida en un objeto JSON
        const data = JSON.parse(stdout);
        // Extrae y retorna la matrícula si está disponible, o null si no se encuentra
        return ((_b = (_a = data.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.plate) || null;
    }
    catch (error) {
        // Manejo de errores: imprime el error en la consola y retorna null
        console.error("Error ejecutando OpenALPR:", error);
        return null;
    }
});
exports.detectarMatricula = detectarMatricula;
