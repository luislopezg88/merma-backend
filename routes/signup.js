const express = require("express");
const UserModel = require("../schema/user");
const ClienteModel = require("../schema/clientes");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.post("/", async (req, res) => {
  const { nombre, genero, edad, correo, clave } = req.body;

  if (!correo || !clave) {
    return res.status(409).json(
      jsonResponse(409, {
        error: "email y contraseña son obligatorios",
      })
    );
  }

  try {
    const user = new UserModel();
    //Existe el usuario
    const userExists = await user.usernameExists(correo);
    if (userExists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "Email ya existe",
        })
      );
    } else {
      //Crear usuario
      const user = new UserModel({
        email: correo,
        name: nombre,
        password: clave,
      });
      const usuarioGuardado = await user.save();
      
      //Crear cliente
      const nuevoCliente = new ClienteModel({
        id_user: usuarioGuardado._id,
        nombre: nombre,
        sexo: genero,
        edad: edad,
      });
      // Guardar el cliente
      await nuevoCliente.save();

      res.json(
        jsonResponse(200, {
          message: "Creado exitosamente",
        })
      );
    }
  } catch (err) {
    return res.status(500).json(
      jsonResponse(500, {
        error: "Error creando el usuario",
      })
    );
  }
});

module.exports = router;
