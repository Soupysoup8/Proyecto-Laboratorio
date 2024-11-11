import Usuario from '../models/usuarios';
import sequelize from '../config/database';
import { Optional } from 'sequelize';

// Definir el tipo para los datos del usuario
interface UsuarioData {
  id: number;
  nombre: string;
  // otras propiedades del usuario
}

// Se usa 'Optional' para permitir que ciertos campos sean opcionales
type UsuarioUpsertData = Optional<UsuarioData, 'id'>; // 'id' es opcional para upsert

// Función para guardar usuarios
const guardarUsuarios = async (data: UsuarioUpsertData[]): Promise<void> => {
  try {
    // Sincroniza el modelo con la base de datos.
    await sequelize.sync();

    // Itera sobre cada usuario en el arreglo 'data'.
    for (const usuario of data) {
      // 'upsert' agrega o actualiza cada usuario en la base de datos.
      await Usuario.upsert(usuario);
    }
    console.log('Usuarios guardados en la base de datos con éxito.');
  } catch (error: any) {
    console.error('Error al guardar usuarios en la base de datos:', error.message);
  }
};

// Función para leer usuarios desde la base de datos
const leerUsuarios = async (): Promise<UsuarioData[]> => {
  try {
    // Usamos 'findAll' para obtener todos los usuarios de la base de datos y devolvemos 
    // los resultados como objetos simples.
    const usuarios = await Usuario.findAll({ raw: true });
    return usuarios;
  } catch (error: any) {
    console.error('Error al leer usuarios de la base de datos:', error.message);
    return [];
  }
};

export { guardarUsuarios, leerUsuarios };
