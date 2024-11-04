const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("base_datos", "usuario", "nueva_contrasena", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log("Conexión establecida correctamente.");
  })
  .catch((error) => {
    console.error("No se pudo conectar a la base de datos:", error);
  });

module.exports = sequelize;
