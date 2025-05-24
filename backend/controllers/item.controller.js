const Item = require("../models/Item");

exports.crearItem = async (req, res) => {
  try {
    const nuevo = new Item(req.body);
    await nuevo.save();
    res.status(201).json({ mensaje: "Artículo creado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear artículo", error });
  }
};

exports.obtenerItems = async (req, res) => {
  try {
    let items;
    if (req.usuario.rol === "admin") {
      items = await Item.find();
    } else {
      items = await Item.find({ almacen: req.usuario.almacen });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener artículos", error });
  }
};

// ✅ NUEVA FUNCIÓN: Obtener artículos por almacén
exports.obtenerItemsPorAlmacen = async (req, res) => {
  try {
    const codigo = req.params.codigo;

    if (!codigo) {
      return res.status(400).json({ mensaje: "Código de almacén requerido" });
    }

    const items = await Item.find({ almacen: codigo });
    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener artículos del almacén", error });
  }
};

exports.actualizarItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ mensaje: "Artículo actualizado", item });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar artículo", error });
  }
};

exports.eliminarItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Artículo eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar artículo", error });
  }
};