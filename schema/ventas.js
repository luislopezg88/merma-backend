const Mongoose = require("mongoose");

const VentasSchema = new Mongoose.Schema({
  id: { type: Object },
  id_producto: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "productos",
  },
  id_cliente: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "clientes",
  },
  id_mayorista: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "mayoristas",
  },
  cantidad: { type: Number },
  fecha_vencimiento: { type: Date },
  fecha: { type: Date, default: Date.now }
});

VentasSchema.statics.obtenerVentas = async function (id_cliente) {
    const matchStage = {
      $match: {
        id_cliente: id_cliente ? new Mongoose.Types.ObjectId(id_cliente) : { $exists: true },
      },
    };
  
    const resultados = await this.aggregate([
      matchStage,
      {
        $group: {
          _id: "$id_producto",
          totalVentas: { $sum: "$cantidad" },
        },
      },
      {
        $lookup: {
          from: "productos", // Ajusta según el nombre de tu colección de productos
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $lookup: {
          from: "clientes", // Ajusta según el nombre de tu colección de clientes
          localField: "producto.id_cliente",
          foreignField: "_id",
          as: "cliente",
        },
      },
      {
        $unwind: "$cliente",
      },
      {
        $project: {
          _id: 0,
          nombreProducto: "$producto.nombre",
          nombreCliente: "$cliente.nombre",
          totalVentas: 1,
        },
      },
      {
        $sort: { totalVentas: -1 },
      },
    ]);
  
    return resultados;
};

VentasSchema.statics.obtenerVentasPorMayorista = async function () {
    const resultados = await this.aggregate([
        {
            $group: {
                _id: "$id_mayorista",
                totalVentas: { $sum: "$cantidad" },
            },
        },
        {
            $lookup: {
                from: "mayoristas", // Ajusta según el nombre de tu colección de mayoristas
                localField: "_id",
                foreignField: "_id",
                as: "mayorista",
            },
        },
        {
            $unwind: "$mayorista",
        },
        {
            $project: {
                _id: 0,
                nombreMayorista: "$mayorista.nombre",
                totalVentas: 1,
            },
        },
    ]);

    return resultados;
};

module.exports = Mongoose.model("Ventas", VentasSchema);
