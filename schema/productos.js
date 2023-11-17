const Mongoose = require("mongoose");

const ProductoSchema = new Mongoose.Schema({
  id: { type: Object },
  nombre: { type: String },
  descripcion: { type: String },
  imagen: { type: String },
  precio: { type: Number },
  fecha_vencimiento: { type: Date },
});

ProductoSchema.statics.existsByNombre = async function (nombre) {
  const productoCount = await this.countDocuments({ nombre });
  return productoCount > 0;
};

module.exports = Mongoose.model("Productos", ProductoSchema);
