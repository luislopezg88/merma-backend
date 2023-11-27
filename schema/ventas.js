const Mongoose = require("mongoose");

const VentasSchema = new Mongoose.Schema({
  // Cambié la línea siguiente de 'type: Object' a 'type: Mongoose.Schema.Types.ObjectId'
  id: { type: Mongoose.Schema.Types.ObjectId },
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
  precio: { type: Number },
  precio_descuento: { type: Number },
  fecha_vencimiento: { type: Date },
  aplico_descuento: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now },
});

VentasSchema.statics.obtenerProductosConDescuento = async function (id_mayorista) {
  const matchStage = {
    $match: {
      id_mayorista: id_mayorista ? new Mongoose.Types.ObjectId(id_mayorista) : { $exists: true },
      aplico_descuento: true,
    },
  };

  const resultados = await this.aggregate([
    matchStage,
    {
      $group: {
        _id: {
          id_producto: "$id_producto",
          precio: "$precio",
          precio_descuento: "$precio_descuento",
        },
        totalVentas: { $sum: "$cantidad" },
      },
    },
    {
      $lookup: {
        from: "productos", // Ajusta según el nombre de tu colección de productos
        localField: "_id.id_producto",
        foreignField: "_id",
        as: "producto",
      },
    },
    {
      $unwind: "$producto",
    },
    {
      $project: {
        _id: 0,
        nombreProducto: "$producto.nombre",
        precio: { $toDouble: "$_id.precio" },
        precio_descuento: { $toDouble: "$_id.precio_descuento" },
        totalVentas: 1,
      },
    },
  ]);

  // Calcular descuento después de obtener los resultados
  const resultadosConDescuento = resultados.map(resultado => {
    const descuento = resultado.precio - resultado.precio_descuento;
    const porcentajeDescuento = (descuento / resultado.precio) * 100;
    return { ...resultado, porcentajeDescuento };
  });

  // Puedes imprimir para verificar los resultados intermedios
  console.log('Resultados intermedios:', resultadosConDescuento);

  return resultadosConDescuento;
};


VentasSchema.statics.obtenerVentas = async function (id_cliente) {
    /*
    const matchStage = {
      $match: {
        id_cliente: id_cliente ? new Mongoose.Types.ObjectId(id_cliente) : { $exists: true },
      },
    };
    */
    const resultados = await this.aggregate([
      //matchStage,
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
