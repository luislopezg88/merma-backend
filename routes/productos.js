const express = require("express");
const multer = require("multer");
const path = require("path");
const ProductoSchema = require("../schema/productos");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

// Configurar multer carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imagenes/productos/"); // Directorio donde se guardarán las imágenes de productos
  },
  filename: function (req, file, cb) {
    const nombreArchivo = req.body.imagen; // + path.extname(file.originalname);
    cb(null, nombreArchivo);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const items = await ProductoSchema.find({ id_user: req.user.id });
    return res.json(items);
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ error: "Error al obtener los todos" });
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  const {
    nombre,
    descripcion,
    imagen,
    precio,
    fecha_vencimiento,
  } = req.body;

  if (!nombre) {
    return res.status(409).json(
      jsonResponse(409, {
        error: "El nombre es obligatorio",
      })
    );
  }

  try {
    const exists = await ProductoSchema.existsByNombre(nombre);

    if (exists) {
      return res.status(409).json(
        jsonResponse(409, {
          error: "Producto ya existe",
        })
      );
    } else {
      //Crear producto
      const nuevoProducto = new ProductoSchema({
        nombre: nombre,
        descripcion: descripcion,
        imagen: imagen,
        precio: precio,
        fecha_vencimiento: fecha_vencimiento
      });
      // Guardar el producto
      const productoInfo = await nuevoProducto.save();
      res.json(
        jsonResponse(200, {
          productoInfo,
        })
      );
    }
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto" });
  }
});

module.exports = router;
