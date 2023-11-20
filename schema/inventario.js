const Mongoose = require("mongoose");

const InventarioSchema = new Mongoose.Schema({
  id: { type: Object },
  id_producto: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "productos",
  },
  id_mayorista: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "mayoristas",
  },
  cantidad: { type: Number },
  fecha_vencimiento: { type: Date },
  fecha: { type: Date, default: Date.now }
});

InventarioSchema.statics.existsInventario = async function ({ id_producto, id_mayorista, fecha_vencimiento }) {
    const inventarioCount = await this.countDocuments({
      $or: [
        { id_producto },
        { id_mayorista },
        { fecha_vencimiento }
      ]
    });
    return inventarioCount > 0;
}; 

InventarioSchema.statics.idInventario = async function ({ id_producto, id_mayorista, fecha_vencimiento }) {
    const inventario = await this.findOne({
        $or: [
          { id_producto },
          { id_mayorista },
          { fecha_vencimiento }
        ]
    });
      
    return inventario ? inventario._id : null;
}; 

module.exports = Mongoose.model("Inventarios", InventarioSchema);
