const Usuario = require('../models/usuarios');
const Tarea = require('../models/tarea');
const sequelize = require('../config/database');

const guardarDB = async (usuariosData, tareasData) => {
  try {
    // Sincroniza el modelo con la base de datos.
    await sequelize.sync();

    // Itera sobre cada usuario en el arreglo 'usuariosData'.
    for (const usuario of usuariosData) {
      // 'upsert' agrega o actualiza cada usuario en la base de datos.
      await Usuario.upsert(usuario);
    }

    for (const tarea of tareasData) {
      // 'upsert' agrega o actualiza cada tarea en la base de datos.
      await Tarea.upsert(tarea);
    }
    console.log('Datos guardados en la base de datos con éxito.');
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error.message);
  }
};

const leerDB = async () => {
  try {
    // Usamos 'findAll' para obtener todos los usuarios de la base de datos y devolvemos 
    // los resultados como objetos simples.
    const usuarios = await Usuario.findAll({ raw: true });
    const tareas = await Tarea.findAll({ raw: true });
    return { usuarios, tareas };

  } catch (error) {
    console.error('Error al leer de la base de datos:', error.message);
    // Retorna arreglos vacíos en caso de error para mantener la consistencia.
    return { usuarios: [], tareas: [] };
  }
};

module.exports = {
  guardarDB,
  leerDB,
};
