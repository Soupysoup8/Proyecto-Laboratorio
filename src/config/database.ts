import { Sequelize } from 'sequelize';

// Configuración de la conexión con la base de datos MySQL
const sequelize = new Sequelize('tareas', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Desactivar el log de las consultas SQL
});

// Intentamos autenticar la conexión
sequelize.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente.');
  })
  .catch((error: Error) => {
    console.error('No se pudo conectar a la base de datos:', error.message);
  });

export default sequelize;