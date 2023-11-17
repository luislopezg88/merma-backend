const Mongoose = require("mongoose");

const ClienteSchema = new Mongoose.Schema({
  id: { type: Object },
  id_user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nombre: { type: String },
  telefono: { type: String },
  correo: { type: String },
  direccion: { type: String }
});

ClienteSchema.statics.existsById = async function (clienteId) {
  const clienteCount = await this.countDocuments({ _id: clienteId });
  return clienteCount > 0;
};

module.exports = Mongoose.model("clientes", ClienteSchema);
