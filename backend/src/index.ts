import express from "express";
import cors from "cors";
import multer from "multer";
import { detectarMatricula } from "./alpr";
import { verificarMatricula } from "./db";
import { uploadImageToFirebase } from "./storage";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

app.post("/validar", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No se subió ninguna imagen" });
    return;
  }

  try {
    // Subimos la imagen a Firebase Storage y obtenemos la URL
    const imageUrl = await uploadImageToFirebase(req.file.path);
    if (!imageUrl) {
      res.status(500).json({ error: "Error subiendo imagen a Firebase" });
      return;
    }

    // Detectamos la matrícula usando OpenALPR
    const matricula = await detectarMatricula(req.file.path);
    if (!matricula) {
      res.json({ error: "No se detectó matrícula" });
      return;
    }

    // Verificamos si la matrícula está en Firestore
    const autorizada = await verificarMatricula(matricula);
    
    res.json({
      matricula,
      estado: autorizada ? "permitido" : "denegado",
      accion: autorizada ? "abrir compuerta" : "mantener cerrada",
      imageUrl, // Devolvemos la URL de la imagen subida
    });
  } catch (error) {
    res.status(500).json({ error: "Error procesando la imagen" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
