import { Tarea } from '../models/tarea';
import sequelize from '../config/database';
import Usuario from '../models/usuarios'; 

interface UsuarioData {
  nombre: string;
  password: string;
}

interface TareaData {
  // Define las propiedades de una tarea según tu modelo
  id: number;
  desc: string;
  completadoEn: Date | null;
  usuarioId: number;
}

const guardarDB = async (usuariosData: UsuarioData[], tareasData: TareaData[]): Promise<void> => {
  try {
    // Sincroniza el modelo con la base de datos.
    await sequelize.sync();

    // Itera sobre cada usuario en el arreglo 'usuariosData'.
    for (const usuario of usuariosData) {
      // 'upsert' agrega o actualiza cada usuario en la base de datos.
      await Usuario.upsert({
        nombre: usuario.nombre,
        password: usuario.password,
      });
    }

    for (const tarea of tareasData) {
      // 'upsert' agrega o actualiza cada tarea en la base de datos.
      await Tarea.upsert(tarea);
    }
    console.log('Datos guardados en la base de datos con éxito.');
  } catch (error: any) {
    console.error('Error al guardar en la base de datos:', error.message);
  }
};

const leerDB = async (): Promise<{ usuarios: UsuarioData[]; tareas: TareaData[] }> => {
  try {
    // Usamos 'findAll' para obtener todos los usuarios de la base de datos y devolvemos 
    // los resultados como objetos simples.
    const usuarios = await Usuario.findAll({ raw: true });
    const tareas = await Tarea.findAll({ raw: true });
    return { usuarios, tareas };

  } catch (error: any) {
    console.error('Error al leer de la base de datos:', error.message);
    // Retorna arreglos vacíos en caso de error para mantener la consistencia.
    return { usuarios: [], tareas: [] };
  }
};

export { guardarDB, leerDB };
