const express = require("express");
const ProductoSchema = require("../schema/productos");
const Ventas = require("../schema/ventas");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

// Ruta para guardar la lista de productos vendidos
router.post("/", async (req, res) => {
  try {
    // Cambié de req.body.listaProductos a req.body
    const listaProductos = req.body;

    // Iterar sobre la lista de productos y guardarlos en la base de datos
    for (const producto of listaProductos) {
      const descuentoAplicado = producto.precio_descuento < producto.precio; // Asumiendo que un descuento se aplica si el precio con descuento es menor que el precio original
      const nuevoProducto = new Ventas({
        id_producto: producto.id,
        id_cliente: producto.id_cliente,
        id_mayorista: producto.id_mayorista,
        cantidad: producto.cantidad,
        precio: producto.precio,
        precio_descuento: producto.precio_descuento,
        fecha_vencimiento: producto.fecha_vencimiento,
        aplico_descuento: descuentoAplicado,
      });
      await nuevoProducto.save();
    }

    res
      .status(200)
      .json({ mensaje: "Venta realizada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


module.exports = router;
