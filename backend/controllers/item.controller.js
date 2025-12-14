const Item = require("../models/Item");
const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db');

exports.crearItem = async (req, res) => {
  try {
    const nuevo = await Item.create(req.body);
    res.status(201).json({ mensaje: "Artículo creado" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear artículo", error });
  }
};

exports.obtenerItems = async (req, res) => {
  try {
    let where = {};
    if (req.usuario.rol === "almacenista") {
      where.almacenId = req.usuario.almacenId;
    }
    const items = await Item.findAll({
      where,
      include: [{ model: require('../models/Almacen'), as: 'almacen' }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener artículos", error });
  }
};

// ✅ NUEVA FUNCIÓN: Obtener artículos por almacén
exports.obtenerItemsPorAlmacen = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await Item.findAll({
      where: { almacenId: id },
      include: [{ model: require('../models/Almacen'), as: 'almacen' }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener artículos del almacén", error });
  }
};

exports.actualizarItem = async (req, res) => {
  try {
    const [updated] = await Item.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const item = await Item.findByPk(req.params.id, {
        include: [{ model: require('../models/Almacen'), as: 'almacen' }]
      });
      res.json({ mensaje: "Artículo actualizado", item });
    } else {
      res.status(404).json({ mensaje: "Artículo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar artículo", error });
  }
};

exports.eliminarItem = async (req, res) => {
  try {
    const deleted = await Item.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ mensaje: "Artículo eliminado" });
    } else {
      res.status(404).json({ mensaje: "Artículo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar artículo", error });
  }
};

// Nueva función: Buscar artículos
exports.buscarItems = async (req, res) => {
  try {
    const { query } = req.query;
    let where = {};
    if (req.usuario.rol === "almacenista") {
      where.almacenId = req.usuario.almacenId;
    }
    if (query) {
      const lowerQuery = query.toLowerCase();
      where[Op.or] = [
        sequelize.where(sequelize.fn('LOWER', sequelize.col('nombre')), { [Op.like]: `%${lowerQuery}%` }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('tipo')), { [Op.like]: `%${lowerQuery}%` }),
        sequelize.where(sequelize.fn('LOWER', sequelize.col('categoria')), { [Op.like]: `%${lowerQuery}%` })
      ];
    }
    const items = await Item.findAll({
      where,
      include: [{ model: require('../models/Almacen'), as: 'almacen' }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar artículos", error });
  }
};