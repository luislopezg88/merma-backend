const express = require("express");
const VentasSchema = require("../schema/ventas");
const MayoristaSchema = require("../schema/mayoristas");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.get("/", async (req, res) => {
  return "hola";
});

router.get("/clientes/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const data = await VentasSchema.dashboard({ id_cliente: id });

    res.json(
      jsonResponse(200, {
        data,
        recordsTotal: data.length,
      })
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error al obtener los productos vendidos",
      })
    );
  }
});

// Ruta para productos más vendidos
router.get("/ventas", async (req, res) => {
  const data = await VentasSchema.obtenerVentas();

  return res.json(
    jsonResponse(200, {
      data,
      recordsTotal: data.length,
    })
  );
});

// Ruta para productos más vendidos del mayorista
router.get("/ventas/:id_usuario", async (req, res) => {
  const { id_usuario } = req.params;
  // Buscar el id_mayorista asociado al id_usuario en la colección "mayorista"
  const mayorista = await MayoristaSchema.findOne({ id_user: id_usuario });

  if (!mayorista) {
    return res.status(404).json(
      jsonResponse(404, {
        error: "No se encontró un mayorista asociado a este usuario",
      })
    );
  }

  const id_mayorista = mayorista._id;
  console.log(id_mayorista);
  const data = await VentasSchema.obtenerProductosConDescuento(id_mayorista);
  return res.json(
    jsonResponse(200, {
      data,
      recordsTotal: data.length,
    })
  );
});

module.exports = router;
