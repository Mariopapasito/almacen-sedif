const PDFDocument = require("pdfkit");
const Vale = require("../models/Vale");
const Item = require("../models/Item");

// ✅ Crear vale (admin puede elegir almacén, almacenista usa su almacén)
exports.crearVale = async (req, res) => {
  try {
    const { producto, cantidad } = req.body;
    const usuario = req.usuario;

    // ✅ Definir el almacén: admin lo elige, almacenista toma el propio
    const almacen = usuario.rol === "admin" ? req.body.almacen : usuario.almacen;

    if (!almacen) {
      return res.status(400).json({ mensaje: "Almacén no especificado" });
    }

    // ✅ Restar stock solo si hay suficiente
    const item = await Item.findOneAndUpdate(
      {
        nombre: producto,
        almacen,
        cantidad: { $gte: cantidad },
      },
      { $inc: { cantidad: -cantidad } },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ mensaje: "Stock insuficiente o artículo no encontrado en el almacén" });
    }

    // ✅ Registrar el vale
    const vale = new Vale({
      ...req.body,
      almacen,
    });

    await vale.save();

    res.status(201).json({ mensaje: "Vale registrado correctamente", vale });
  } catch (error) {
    console.error("Error al registrar vale:", error);
    res.status(500).json({ mensaje: "Error al registrar vale", error });
  }
};

// 🔍 Obtener vales según rol
exports.obtenerVales = async (req, res) => {
  try {
    const usuario = req.usuario;
    const filtro = usuario.rol === "admin" ? {} : { almacen: usuario.almacen };
    const vales = await Vale.find(filtro);
    res.json(vales);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar vales", error });
  }
};

// 🧾 Generar PDF del vale
exports.generarPDF = async (req, res) => {
  try {
    const vale = await Vale.findById(req.params.id);
    if (!vale) return res.status(404).json({ mensaje: "Vale no encontrado" });

    // ✅ Validar acceso
    if (req.usuario.rol !== "admin" && vale.almacen !== req.usuario.almacen) {
      return res.status(403).json({ mensaje: "Acceso denegado al vale" });
    }

    // Generar el PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=vale.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Vale de Salida de Almacén", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${vale.fecha.toLocaleDateString()}`);
    doc.text(`Hora: ${vale.fecha.toLocaleTimeString()}`);
    doc.moveDown();
    doc.text(`Producto: ${vale.producto}`);
    doc.text(`Cantidad: ${vale.cantidad}`);
    doc.text(`Entregado por: ${vale.entregadoPor}`);
    doc.text(`Recibido por: ${vale.recibidoPor}`);
    doc.text(`Almacén: ${vale.almacen}`);
    doc.moveDown();
    doc.text("_____________________     _____________________");
    doc.text("Firma quien entrega          Firma quien recibe");

    doc.end();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar PDF", error });
  }
};