const express = require("express");
const { jsonResponse } = require("../lib/jsonResponse");
const ClienteModel = require("../schema/clientes");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await ClienteModel.find();
    return res.json(
      jsonResponse(200, {
        data,
        recordsTotal: data.length,
      })
    );
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los todos" });
  }
});

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const data = await ClienteModel.findOne({ id_user: id });

    res.json(
      jsonResponse(200, {
        data,
      })
    );
  } catch (err) {
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error al obtener la lista de clientes",
      })
    );
  }
});

router.put("/:id", async function (req, res) {
  const {
    nombre,
    telefono,
    correo,
    direccion
  } = req.body;
  const id = req.params.id;

  try {
    //const exists = await ClienteModel.exists({ _id: id });
    const exists = await ClienteModel.existsById(id);

    if (!exists) {
      return res.status(404).json({
        error: "El cliente no existe",
      });
    }

    const result = await ClienteModel.updateOne(
      { _id: id },
      {
        $set: {
          nombre,
          telefono,
          correo,
          direccion
        },
      }
    );

    if (result.matchedCount > 0) {
      return res.status(200).json({
        message: `Cliente actualizado con éxito, matched:${result.matchedCount}.`,
      });
    } else {
      return res.status(500).json({
        error:
          "Cliente no encontrado o los datos son iguales, no se realizó ninguna actualización",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Error al actualizar el cliente",
    });
  }
});

module.exports = router;
