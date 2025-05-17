const PDFDocument = require("pdfkit");
const Vale = require("../models/Vale");

exports.crearVale = async (req, res) => {
  try {
    const vale = new Vale(req.body);
    await vale.save();
    res.status(201).json({ mensaje: "Vale registrado correctamente", vale });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar vale", error });
  }
};

exports.obtenerVales = async (req, res) => {
  try {
    const vales = req.usuario.rol === "admin"
      ? await Vale.find()
      : await Vale.find({ entregadoPor: req.usuario.nombre });

    res.json(vales);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar vales", error });
  }
};

exports.generarPDF = async (req, res) => {
  try {
    const vale = await Vale.findById(req.params.id);
    if (!vale) return res.status(404).json({ mensaje: "Vale no encontrado" });

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
    doc.moveDown();
    doc.text("_____________________     _____________________");
    doc.text("Firma quien entrega       Firma quien recibe");

    doc.end();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar PDF", error });
  }
};
