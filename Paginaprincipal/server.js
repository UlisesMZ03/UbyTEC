const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// URL de conexión de MongoDB Atlas
const url = "mongodb+srv://sebashb1405:hola@cluster0.k6vkv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(bodyParser.json());

let db;

// Conectar a MongoDB Atlas y almacenar la base de datos en `db`
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    db = client.db("UbyTEC"); // Nombre de la base de datos en MongoDB Atlas
    console.log("Conectado a MongoDB Atlas");
  })
  .catch((error) => console.error("Error al conectar a MongoDB Atlas:", error));

// Endpoint para recibir feedback
app.post("/feedback", async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: "La base de datos no está inicializada" });
  }

  try {
    const { feedback } = req.body;
    if (!feedback) return res.status(400).json({ error: "Feedback vacío" });

    // Inserta el feedback en la colección "UbytecCollection"
    const result = await db.collection("UbytecCollection").insertOne({ FeedBack: feedback });
    res.status(201).json({ message: "Feedback guardado exitosamente", feedbackId: result.insertedId });
  } catch (error) {
    console.error("Error al guardar el feedback:", error);
    res.status(500).json({ error: "Error al guardar el feedback" });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
