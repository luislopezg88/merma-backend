const express = require("express");
const UserModel = require("../schema/user");
const ClienteModel = require("../schema/clientes");
const MayoristaModel = require("../schema/mayoristas");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.post("/", async (req, res) => {
  const { nombre, email, password, rol, telefono, direccion, descripcion, ubicacion } = req.body;

  if (!email || !password) {
    return res.status(409).json(
      jsonResponse(409, {
        error: "email y contraseña son obligatorios",
      })
    );
  }

  try {
    const user = new UserModel();
    //Existe el usuario
    const userExists = await user.usernameExists(email);
    if (userExists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "Email ya existe",
        })
      );
    } else {
      //Crear usuario
      const user = new UserModel({
        email: email,
        name: nombre,
        password: password,
        rol: rol
      });
      const usuarioGuardado = await user.save();
      
      if(rol == 'cliente'){
        //Crear cliente
        const nuevoCliente = new ClienteModel({
          id_user: usuarioGuardado._id,
          nombre: nombre,
          telefono: telefono,
          email: email,
          direccion: direccion
        });
        // Guardar el cliente
        await nuevoCliente.save();
      }else{
        //Crear mayorista
        const nuevoMayorista = new MayoristaModel({
          id_user: usuarioGuardado._id,
          nombre: nombre,
          descripcion: descripcion,
          telefono: telefono,
          email: email,
          ubicacion: ubicacion
        });
        // Guardar el mayorista
        await nuevoMayorista.save();
      }

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
