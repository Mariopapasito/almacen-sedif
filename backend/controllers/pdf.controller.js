const PDFDocument = require("pdfkit");
const Vale = require("../models/Vale");
const Item = require("../models/Item");
const Almacen = require("../models/Almacen");
const path = require('node:path');
const fs = require('node:fs');
const { Op, QueryTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// ✅ Crear vale (admin puede elegir almacén, almacenista usa su almacén)
exports.crearVale = async (req, res) => {
  try {
    const { items, almacenId, recibidoPor } = req.body;
    const usuario = req.usuario;

    // ✅ Definir el almacén: admin lo elige, almacenista toma el propio
    const almacenIdFinal = usuario.rol === "admin" ? almacenId : usuario.almacenId;

    if (!almacenIdFinal) {
      return res.status(400).json({ mensaje: "Almacén no especificado" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ mensaje: "Debe enviar al menos un artículo" });
    }

    // ✅ Procesar y restar stock de cada artículo
    const detallesVale = [];
    for (const it of items) {
      const { nombre, cantidad, codigoBarras, almacenId: itemAlmacenId } = it;
      if (!nombre && !codigoBarras) {
        return res.status(400).json({ mensaje: "Cada artículo debe tener nombre o código de barras" });
      }
      if (!cantidad || cantidad <= 0 || isNaN(cantidad)) {
        return res.status(400).json({ mensaje: `Cantidad inválida para artículo: ${nombre || codigoBarras} (cantidad: ${cantidad})` });
      }

      // Usar el almacenId del item si está disponible, sino usar el general
      const almacenIdParaBusqueda = itemAlmacenId || almacenIdFinal;

      // Buscar el producto
      let item;
      
      if (codigoBarras) {
        // Buscar por código de barras
        item = await Item.findOne({ 
          where: {
            almacenId: almacenIdParaBusqueda,
            codigoBarras: codigoBarras,
            cantidad: { [Op.gte]: cantidad }
          }
        });
      } else {
        // Buscar por nombre usando consulta directa (case-insensitive)
        const items = await sequelize.query(
          `SELECT * FROM Items WHERE almacenId = ? AND LOWER(nombre) = LOWER(?) AND cantidad >= ? LIMIT 1`,
          {
            replacements: [almacenIdParaBusqueda, nombre.trim(), cantidad],
            type: QueryTypes.SELECT
          }
        );
        
        if (items && items.length > 0) {
          item = await Item.findByPk(items[0].id);
        }
      }

      if (!item) {
        return res.status(400).json({ mensaje: `Stock insuficiente o artículo no encontrado en este almacén: "${nombre || codigoBarras}" (necesitas ${cantidad} unidades, almacén ID: ${almacenIdParaBusqueda})` });
      }

      await Item.decrement('cantidad', { by: cantidad, where: { id: item.id } });

      // Guardar item con almacenId para identificar de dónde viene
      detallesVale.push({ 
        nombre: item.nombre, 
        cantidad, 
        codigoBarras: item.codigoBarras || null,
        almacenId: item.almacenId
      });
    }

    // ✅ Registrar el vale con todos los artículos
    const vale = await Vale.create({
      items: detallesVale,
      recibidoPor: recibidoPor,
      almacenId: almacenIdFinal,
      entregadoPorId: req.usuario.id,
    });

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
    // Admin ve todos los vales, almacenistas solo ven los que ellos crearon
    const where = usuario.rol === "admin" ? {} : { entregadoPorId: usuario.id };
    const vales = await Vale.findAll({
      where,
      include: [{ model: Almacen, as: 'almacen' }, { model: require('../models/User'), as: 'entregadoPor' }]
    });
    res.json(vales);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar vales", error });
  }
};

// 🧾 Generar PDF del vale
exports.generarPDF = async (req, res) => {
  try {
    const vale = await Vale.findByPk(req.params.id, {
      include: [{ model: Almacen, as: 'almacen' }, { model: require('../models/User'), as: 'entregadoPor' }]
    });
    if (!vale) return res.status(404).json({ mensaje: "Vale no encontrado" });

    // ✅ Validar acceso
    if (req.usuario.rol !== "admin" && vale.almacenId !== req.usuario.almacenId) {
      return res.status(403).json({ mensaje: "Acceso denegado al vale" });
    }

    // Generar el PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=vale.pdf");
    doc.pipe(res);

    // Agregar logo si existe
    const logoPath = path.join(__dirname, '..', '..', 'frontend', 'public', 'logo-sedif.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 20, { width: 80 });
    }

    // Título
    doc.fontSize(20).font('Helvetica-Bold').text("VALE DE ENTREGA DE MATERIALES", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica').text("SEDIF - Sistema de Almacén", { align: "center" });
    doc.moveDown();

    // Información del vale
    doc.fontSize(12).font('Helvetica');
    doc.text(`Número de Vale: ${vale.id}`, { continued: true });
    doc.text(`Fecha: ${vale.fecha.toLocaleDateString()}`, { align: "right" });
    doc.moveDown(0.5);
    // Lista de artículos
    doc.moveDown(0.5);
    doc.font('Helvetica-Bold').text("Artículos:");
    doc.font('Helvetica');
    
    // Cargar información de almacenes para cada item
    for (const it of vale.items || []) {
      let almacenNombre = 'N/A';
      if (it.almacenId) {
        const almacen = await Almacen.findByPk(it.almacenId);
        if (almacen) {
          almacenNombre = almacen.nombre;
        }
      }
      doc.text(`${it.nombre}: ${it.cantidad} unidades (${almacenNombre})`);
    }
    doc.moveDown();

    // Detalles
    doc.text(`Entregado por: ${vale.entregadoPor.nombre}`);
    doc.text(`Recibido por: ${vale.recibidoPor}`);
    doc.moveDown();

    // Leyenda
    doc.fontSize(10).text("Este vale es oficial y debe ser presentado para cualquier reclamación o devolución de materiales.", { align: "justify" });
    doc.moveDown(2);

    // Firmas
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text("FIRMAS DE CONFORMIDAD", { align: "center" });
    doc.moveDown();

    // Líneas para firmas (sin fecha debajo)
    const y = doc.y;
    doc.font('Helvetica').fontSize(10);
    doc.text("_______________________________", 50, y);
    doc.text("Firma de quien entrega", 50, y + 15);
    // Fecha removida

    doc.text("_______________________________", 300, y);
    doc.text("Firma de quien recibe", 300, y + 15);
    // Fecha removida

    doc.end();
  } catch (error) {
    res.status(500).json({ mensaje: "Error al generar PDF", error });
  }
};

// 🗑️ Eliminar vale
exports.eliminarVale = async (req, res) => {
  try {
    const vale = await Vale.findByPk(req.params.id);
    if (!vale) return res.status(404).json({ mensaje: "Vale no encontrado" });

    // ✅ Validar acceso
    if (req.usuario.rol !== "admin" && vale.almacenId !== req.usuario.almacenId) {
      return res.status(403).json({ mensaje: "Acceso denegado al vale" });
    }

    await vale.destroy();
    res.json({ mensaje: "Vale eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar vale", error });
  }
};