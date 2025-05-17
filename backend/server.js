const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/user"); // ✅ Modelo correcto

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Rutas de tu API (ninguna protegida aquí globalmente)
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/items", require("./routes/item.routes"));
app.use("/api/vales", require("./routes/pdf.routes"));

// ✅ Ruta pública para archivos subidos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

// 🔐 CREACIÓN DE SUPERUSUARIO AUTOMÁTICO
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

// 🟢 INICIAR SERVIDOR
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await crearSuperUsuario();
});
