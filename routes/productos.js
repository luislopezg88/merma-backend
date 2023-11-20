const express = require("express");
const multer = require("multer");
const path = require("path");
const ProductoSchema = require("../schema/productos");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

// Configurar multer carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "imagenes/"); // Directorio donde se guardarán las imágenes de productos
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
    precio
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
        precio: precio
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

router.post("/inventario/", async (req, res) => {
  const {
    id_producto,
    id_mayorista,
    cantidad,
    fecha_vencimiento
  } = req.body;

  if (!cantidad || !fecha_vencimiento) {
    return res.status(409).json(
      jsonResponse(409, {
        error: "El cantidad y fecha de vencimiento son obligatorios",
      })
    );
  }

  try {
    const exists = await InventarioSchema.existsInventario(id_producto, id_mayorista, fecha_vencimiento);

    if (exists) {
      const id = await InventarioSchema.idInventario(id_producto, id_mayorista, fecha_vencimiento);
      const result = await InventarioSchema.updateOne(
        { _id: id },
        {
          $set: {
            cantidad
          },
        }
      );
  
      if (result.matchedCount > 0) {
        return res.status(200).json({
          message: `Inventario actualizado con éxito, matched:${result.matchedCount}.`,
        });
      } else {
        return res.status(500).json({
          error:
            "Inventario no encontrado o los datos son iguales, no se realizó ninguna actualización",
        });
      }
    } else {
      //Crear producto en inventario
      const nuevoInventario = new InventarioSchema({
        id_producto: id_producto,
        id_mayorista: id_mayorista,
        cantidad: cantidad,
        fecha_vencimiento: fecha_vencimiento
      });
      // Guardar el producto en inventario
      const inventarioInfo = await nuevoInventario.save();
      res.json(
        jsonResponse(200, {
          inventarioInfo,
        })
      );
    }
  } catch (error) {
    res.status(500).json({ error: "Error al cargar el producto en inventario" });
  }
});

module.exports = router;
