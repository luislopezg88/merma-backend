const express = require("express");
const VentasSchema = require("../schema/ventas");
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
router.get("/ventas/:id_mayorista", async (req, res) => {
  const { id_mayorista } = req.params;
  const data = await VentasSchema.obtenerVentas(id_mayorista);
  return res.json(
    jsonResponse(200, {
      data,
      recordsTotal: data.length,
    })
  );
});

module.exports = router;
