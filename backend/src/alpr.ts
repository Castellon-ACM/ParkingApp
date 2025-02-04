import { exec } from "child_process";
import { promisify } from "util";

// Convierte exec en una función basada en promesas
const execPromise = promisify(exec);

/**
 * Detecta la matrícula de un vehículo en una imagen utilizando OpenALPR dentro de un contenedor Docker.
 * 
 * @param {string} imagePath - Ruta de la imagen a analizar.
 * @returns {Promise<string | null>} - La matrícula detectada o null si no se encuentra ninguna.
 */

export const detectarMatricula = async (imagePath: string): Promise<string | null> => {
  try {
    // Ejecuta el comando OpenALPR dentro del contenedor Docker "alpr"
    const { stdout } = await execPromise(`docker exec alpr alpr -j ${imagePath}`);
    
    // Convierte la salida en un objeto JSON
    const data = JSON.parse(stdout);
    
    // Extrae y retorna la matrícula si está disponible, o null si no se encuentra
    return data.results?.[0]?.plate || null;
  } catch (error) {
    // Manejo de errores: imprime el error en la consola y retorna null
    console.error("Error ejecutando OpenALPR:", error);
    return null;
  }
};