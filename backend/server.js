const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/user");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS configurado correctamente con preflight
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 💥 clave para resolver el 403 por preflight

// Middleware para JSON
app.use(express.json());

// Rutas de la API
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/items", require("./routes/item.routes"));
app.use("/api/vales", require("./routes/pdf.routes"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

// 🔐 CREA SUPERUSUARIO
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
        almacen: "Todos"
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

// 🟢 INICIA SERVIDOR
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await crearSuperUsuario();
});
