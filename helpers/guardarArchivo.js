const fs = require('fs');
const path = require('path');

// Se define la ruta del archivo 'data.json' en la carpeta 'db' ubicada un nivel por encima del directorio actual
const archivo = path.join(__dirname, '../db/data.json');

// Función para guardar datos en el archivo 'data.json'
// Recibe dos parámetros: 'usuarios' y 'tareas'
// Se utiliza 'writeFileSync' para escribir de manera síncrona
const guardarDB = (usuarios, tareas) => {
    const data = { usuarios, tareas };
    fs.writeFileSync(archivo, JSON.stringify(data, null, 2));
}

// Función para leer datos del archivo 'data.json'
// Si no existe, se devuelve un objeto vacío para usuarios y tareas
const leerDB = () => {
    if (!fs.existsSync(archivo)) {
        return { usuarios: [], tareas: [] };
    }
    
    const info = fs.readFileSync(archivo, { encoding: 'utf-8' });
    // Se convierte el contenido JSON a un objeto JavaScript y se devuelve
    return JSON.parse(info);
}

module.exports = {
    guardarDB,
    leerDB
}
