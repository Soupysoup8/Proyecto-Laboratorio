"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Configuración de la conexión con la base de datos MySQL
const sequelize = new sequelize_1.Sequelize('base_datos', 'usuario', 'nueva_contrasena', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Desactivar el log de las consultas SQL
});
// Intentamos autenticar la conexión
sequelize.authenticate()
    .then(() => {
    console.log('Conexión establecida correctamente.');
})
    .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error.message);
});
exports.default = sequelize;
