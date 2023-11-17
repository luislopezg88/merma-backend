const Mongoose = require("mongoose");

const MayoristaSchema = new Mongoose.Schema({
  id: { type: Object },
  id_user: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nombre: { type: String },
  descripcion: { type: String },
  telefono: { type: String },
  correo: { type: String },
  ubicacion: { type: String }
});

MayoristaSchema.statics.existsById = async function (mayoristaId) {
  const mayoristaCount = await this.countDocuments({ _id: mayoristaId });
  return mayoristaCount > 0;
};

module.exports = Mongoose.model("mayoristas", MayoristaSchema);
