const Almacen = require("../models/Almacen");
const Item = require("../models/Item");
const User = require("../models/User");
const Vale = require("../models/Vale");

exports.crearAlmacen = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const nuevoAlmacen = await Almacen.create({ nombre, descripcion });
    res.status(201).json({ mensaje: "Almacén creado", almacen: nuevoAlmacen });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear almacén", error });
  }
};

exports.obtenerAlmacenes = async (req, res) => {
  try {
    const almacenes = await Almacen.findAll();
    res.json(almacenes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener almacenes", error });
  }
};

exports.obtenerAlmacen = async (req, res) => {
  try {
    const { id } = req.params;
    const almacenId = parseInt(id);
    if (isNaN(almacenId)) {
      return res.status(400).json({ mensaje: "ID de almacén inválido" });
    }
    const almacen = await Almacen.findByPk(almacenId);
    if (!almacen) {
      return res.status(404).json({ mensaje: "Almacén no encontrado" });
    }
    res.json(almacen);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener almacén", error });
  }
};

exports.eliminarAlmacen = async (req, res) => {
  try {
    const { id } = req.params;
    const almacenId = parseInt(id);
    if (isNaN(almacenId)) {
      return res.status(400).json({ mensaje: "ID de almacén inválido" });
    }
    const almacen = await Almacen.findByPk(almacenId);
    if (!almacen) {
      return res.status(404).json({ mensaje: "Almacén no encontrado" });
    }
    // Verificar si tiene usuarios asignados
    const usuarios = await User.findAll({ where: { almacenId } });
    if (usuarios.length > 0) {
      return res.status(400).json({ mensaje: "No se puede eliminar almacén con usuarios asignados" });
    }
    // Set almacenId to null in items and vales
    await Item.update({ almacenId: null }, { where: { almacenId } });
    await Vale.update({ almacenId: null }, { where: { almacenId } });
    await Almacen.destroy({ where: { id: almacenId } });
    res.json({ mensaje: "Almacén eliminado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar almacén", error });
  }
};