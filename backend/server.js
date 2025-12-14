const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");
const path = require("path");
const fs = require("fs");

dotenv.config();
connectDB();

const app = express();

// Configuración CORS para desarrollo local
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Carpeta 'uploads' creada automáticamente.");
}

// Servir archivos estáticos de uploads
app.use("/uploads", express.static(uploadsDir));

// Rutas API
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/items", require("./routes/item.routes"));
app.use("/api/vales", require("./routes/pdf.routes"));
app.use("/api/almacenes", require("./routes/almacen.routes"));

// Ruta 404 si no coincide ninguna
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5050;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await sequelize.sync({ alter: true }); // Sincroniza cambios sin borrar datos
});
