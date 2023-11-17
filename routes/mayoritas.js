const express = require("express");
const { jsonResponse } = require("../lib/jsonResponse");
const MayoristaModel = require("../schema/mayoristas");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await MayoristaModel.find();
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
    const data = await MayoristaModel.findOne({ id_user: id });

    res.json(
      jsonResponse(200, {
        data,
      })
    );
  } catch (err) {
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error al obtener la lista de mayoristas",
      })
    );
  }
});

router.put("/:id", async function (req, res) {
  const {
    nombre,
    descripcion,
    telefono,
    correo,
    ubicacion
  } = req.body;
  const id = req.params.id;

  try {
    //const exists = await MayoristaModel.exists({ _id: id });
    const exists = await MayoristaModel.existsById(id);

    if (!exists) {
      return res.status(404).json({
        error: "El mayorista no existe",
      });
    }

    const result = await MayoristaModel.updateOne(
      { _id: id },
      {
        $set: {
          nombre,
          descripcion,
          telefono,
          correo,
          ubicacion
        },
      }
    );

    if (result.matchedCount > 0) {
      return res.status(200).json({
        message: `Mayorista actualizado con éxito, matched:${result.matchedCount}.`,
      });
    } else {
      return res.status(500).json({
        error:
          "Mayorista no encontrado o los datos son iguales, no se realizó ninguna actualización",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Error al actualizar el mayorista",
    });
  }
});

module.exports = router;
