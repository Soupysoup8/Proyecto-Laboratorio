const fs = require('fs');

const archivoUsuarios = './db/usuarios.json';

const guardarUsuarios = (data) => {
    fs.writeFileSync(archivoUsuarios, JSON.stringify(data));
}

const leerUsuarios = () => {
    if (!fs.existsSync(archivoUsuarios)) {
        return [];
    }
    const info = fs.readFileSync(archivoUsuarios, { encoding: 'utf-8' });
    return JSON.parse(info);
}

module.exports = {
    guardarUsuarios,
    leerUsuarios
};