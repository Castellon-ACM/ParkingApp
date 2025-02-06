import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import axios from "axios";

const API_URL = "http://192.168.56.1:8000/validar";

const App = () => {
  const [estadoCapturarFoto, setEstadoCapturarFoto] = useState<string | null>(null); // Estado para almacenar la foto capturada.
  const { hasPermission, requestPermission } = useCameraPermission(); // Hook para manejar permisos de la cámara.
  const device = useCameraDevice("back"); // Obtiene el dispositivo de cámara trasera.
  const camaraRef = useRef<Camera>(null); // Referencia a la cámara para interactuar con ella.

  useEffect(() => {
    if (!hasPermission) {
      requestPermission(); // Si no hay permiso, solicita permiso para acceder a la cámara.
    }
  }, [hasPermission]);

  // Función para capturar la foto.
  const tomarFoto = async () => {
    if (!camaraRef.current) return; // Si no hay cámara, no hace nada.
    try {
      const foto = await camaraRef.current.takePhoto(); // Toma una foto.
      setEstadoCapturarFoto(foto.path); // Guarda la ruta de la foto capturada.
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto"); // Muestra un error si algo sale mal.
    }
  };

  // Función para subir la foto al servidor.
  const subirFoto = async () => {
    if (!estadoCapturarFoto) return; // Si no hay foto, no hace nada.

    const formatoImagen = new FormData();
    formatoImagen.append("file", {
      uri: `file://${estadoCapturarFoto}`, // Crea un objeto para enviar la imagen.
      name: "matricula.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await axios.post(API_URL, formatoImagen, {
        headers: { "Content-Type": "multipart/form-data" }, // Configura los headers para enviar un formulario con imagen.
      });
      Alert.alert("Resultado", response.data.estado); // Muestra el estado de la matrícula (permitida o denegada).
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar la imagen"); // Muestra un error si no se puede enviar la imagen.
    }
  };

  // Si no se tienen permisos para usar la cámara, muestra un mensaje solicitando permisos.
  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Solicitando permisos de cámara...</Text>
      </View>
    );
  }

  // Si no se detecta un dispositivo de cámara, muestra un mensaje de error.
  if (!device) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No se encontró la cámara</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {estadoCapturarFoto ? ( // Si hay una foto capturada, muestra la imagen y opciones para tomar otra o enviarla.
        <>
          <Image source={{ uri: `file://${estadoCapturarFoto}` }} style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => setEstadoCapturarFoto(null)} style={{ padding: 20, backgroundColor: "red" }}>
            <Text style={{ color: "white", textAlign: "center" }}>Tomar otra</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={subirFoto} style={{ padding: 20, backgroundColor: "green" }}>
            <Text style={{ color: "white", textAlign: "center" }}>Enviar</Text>
          </TouchableOpacity>
        </>
      ) : ( // Si no hay foto capturada, muestra la cámara para capturarla.
        <View style={{ flex: 1, position:"relative" }}>
          <Camera
            ref={camaraRef}
            style={{ flex: 1 }}
            device={device}
            isActive={true}
            photo={true}
          />
          <TouchableOpacity
            onPress={tomarFoto}
            style={{
              position: "absolute",
              bottom: 50,
              alignSelf: "center",
              padding: 20,
              backgroundColor: "blue",
              zIndex: 10
            }}
          >
            <Text style={{ color: "white" }}>Tomar Foto</Text>
          </TouchableOpacity>
        </View>

      )}
    </View>
  );
};

export default App;
