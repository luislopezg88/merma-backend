const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const authenticateToken = require("./auth/authenticateToken");
const log = require("./lib/trace");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3100;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log("Conectado a la base de datos");
}

app.use("/api/login", require("./routes/login"));
app.use("/api/signup", require("./routes/signup"));
app.use("/api/signout", require("./routes/logout"));
app.use("/api/mayoristas", require("./routes/mayoristas"));
app.use("/api/clientes", require("./routes/clientes"));

app.use("/api/productos", require("./routes/productos"));
app.use("/api/productos/inventario", require("./routes/productos"));
app.use("/api/productos/selectProductos", require("./routes/productos"));
app.use("/api/productos/tiendaProductos", require("./routes/productos"));
app.use("/api/productos/inventario", require("./routes/productos"));

app.use("/api/carrito", require("./routes/carrito"));

app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/dashboard/ventas", require("./routes/dashboard"));
app.use("/api/users", require("./routes/user"));

const path = require('path');
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));

// Ruta para renovar el
app.use("/api/refresh-token", require("./routes/refreshToken"));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
