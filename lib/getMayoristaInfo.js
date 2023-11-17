function getMayoristaInfo(mayorista) {
    return {
      id: mayorista.id || mayorista._id,
      nombre: mayorista.nombre,
      id_user: mayorista.id_user
    };
  }
  
  module.exports = getMayoristaInfo;
  