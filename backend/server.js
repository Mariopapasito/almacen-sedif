const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("./models/user");

dotenv.config();
connectDB();

const app = express();

// ✅ Configuración CORS para desarrollo local
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight requests

// Middleware para parsear JSON
app.use(express.json());

// ✅ Asegurar que la carpeta uploads exista
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📂 Carpeta 'uploads' creada automáticamente.");
}

// ✅ Archivos estáticos para las imágenes subidas
app.use("/uploads", express.static(uploadsDir));

// ✅ Rutas API
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/items", require("./routes/item.routes"));
app.use("/api/vales", require("./routes/pdf.routes"));

// 🔐 Crear superusuario por defecto si no existe
const crearSuperUsuario = async () => {
  try {
    const adminExiste = await User.findOne({ email: "admin@sedif.mx" });
    if (!adminExiste) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const nuevoAdmin = new User({
        nombre: "Super Admin",
        email: "admin@sedif.mx",
        contraseña: hashedPassword,
        rol: "admin",
        almacen: "Todos",
      });
      await nuevoAdmin.save();
      console.log("✅ Superusuario creado: admin@sedif.mx / admin123");
    } else {
      console.log("ℹ️ Superusuario ya existe.");
    }
  } catch (error) {
    console.error("❌ Error al crear superusuario:", error);
  }
};

// ⚠️ Ruta 404 si no coincide ninguna
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5050;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  await crearSuperUsuario();
});
