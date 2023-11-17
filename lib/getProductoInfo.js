function getProductoInfo(producto) {
    return {
      id: producto.id || producto._id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      fecha_vencimiento: producto.fecha_vencimiento,
    };
  }
  
  module.exports = getProductoInfo;
  