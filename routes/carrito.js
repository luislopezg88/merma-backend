const express = require("express");
const ProductoSchema = require("../schema/productos");
const Ventas = require("../schema/ventas");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

// Ruta para guardar la lista de productos vendidos
router.post("/", async (req, res) => {
  try {
    const listaProductos = req.body.listaProductos;

    // Iterar sobre la lista de productos y guardarlos en la base de datos
    for (const producto of listaProductos) {
      const nuevoProducto = new Ventas({
        id_producto: producto._id,
        id_cliente: producto.id_cliente,
        id_mayorista: producto.id_mayorista,
        cantidad: producto.cantidad,
        precio: producto.precio,
        fecha_vencimiento: producto.fecha_vencimiento
      });
      await nuevoProducto.save();
    }

    res
      .status(200)
      .json({ mensaje: "Venta realizada exitosamente" });
  } catch (ersror) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
