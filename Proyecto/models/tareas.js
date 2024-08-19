const { green, red } = require("colors");
const Tarea = require("./tarea");

class Tareas {
    _listado = {};

    get listadoArr() {

        /* Objects.key convierte el listado a un arreglo
        es decir que, si tuviera solo un console.log(key) 
        mostraria solamente el id de la tarea en lugar 
        de todo el objeto que es tarea.*/
        const listado = [];
        Object.keys(this._listado).forEach( key => {
            const tarea = this._listado[key];
            listado.push( tarea );
        });
    
        return listado;

    }

    constructor() {
        this._listado = {};
    }

    borrarTarea( id = "" ){
        if ( this._listado[id]){
            delete this._listado[id]
        }
    }

    cargarTareasFromArray( tareas = [] ) {
        
        tareas.forEach( tarea => {
            this._listado[tarea.id] = tarea;
        });
    }

    /* Se guarda toda la información de la nueva tarea en un
    objeto dónde la clave es el id. */
    crearTarea( desc = '' ) {

        const tarea = new Tarea(desc);
        this._listado[tarea.id] = tarea;
    }


    /* Mustra el listado completo solo con las
    propiedades de la descripción de la tarea y 
    el estado de esta.
    Se genera un número para cada tarea (iteración)
    y luego desenglosa tareas en desc y en el esstado 
    para poder usarlo luego.
    Dependiendo del estado se encontrará un texto de completado
    o pendiente con los colores verde y rojo respectivamente*/
    listadoCompleto() {
        
        console.log();
        this.listadoArr.forEach( (tarea, i) => {

            const idx = `${i + 1}`.green;
            const { desc, completadoEn } = tarea;
            const estado = ( completadoEn ) 
                                ? 'Completada'.green
                                : 'Pendiente'.red;

            console.log(`${ idx } ${ desc } :: ${ estado }`);

        });         
    }

    
    listarPendientesCompletadas( completadas = true ) {

        console.log();
        let contador = 0;
        this.listadoArr.forEach( tarea => {

            const { desc, completadoEn } = tarea;
            const estado = ( completadoEn ) 
                                ? 'Completada'.green
                                : 'Pendiente'.red;
            if ( completadas ) {
                // mostrar completadas
                if ( completadoEn ) {
                    contador += 1;
                    console.log(`${ (contador + '.').green } ${ desc } :: ${ completadoEn.green }`);
                }
            } else {
                // mostrar pendientes
                if ( !completadoEn ) {
                    contador += 1;
                    console.log(`${ (contador + '.').green } ${ desc } :: ${ estado }`);
                }
            }

        });     

    }

    toggleCompletadas( ids = [] ) {

        ids.forEach( id => {

            const tarea = this._listado[id];
            if ( !tarea.completadoEn ) {
                tarea.completadoEn = new Date().toISOString()
            }

        });

        this.listadoArr.forEach( tarea => {
            /* Si en el arreglo de ids no existe la tarea,
            el estado se vuelve en false */
            if ( !ids.includes(tarea.id) ){
                this._listado[tarea.id].completadoEn = false;
            }
        });
    }
}

module.exports = Tareas;