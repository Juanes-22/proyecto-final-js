import WorkoutGenerator from "./WorkoutGenerator.js";
import Rutina from "./Rutina.js";

export default class YouTrain {
    static LOCAL_STORAGE_DATA_KEY = "youtrain-rutinas";

    constructor(root) {
        this.root = root;
        this.usuario = null;

        const appRoot = root.querySelector("#app");
        const wg = new WorkoutGenerator(appRoot);
    }

    static addRutina(rutinaToSave) {
        const rutinas = YouTrain.#getAllRutinasLocalStorage();

        // verifica si la rutina a guardar existe en el local storage
        const existing = rutinas.find((rutina) => rutina.nombre == rutinaToSave.nombre);

        console.log(rutinaToSave)
        console.log(rutinas)

        if (existing) {
            console.log(existing)
            const { nombre, rondas, dias, items } = rutinaToSave;

            // actualiza valores de rutina existente
            existing.nombre = nombre;
            existing.rondas = rondas;
            existing.dias = dias;
            existing.items = items;
            existing.duracion = existing.calcularDuracion();
            existing.calorias = existing.calcularCalorias();
        } else {
            rutinas.push(rutinaToSave);
        }
        
        YouTrain.#saveRutinasLocalStorage(rutinas);
    }

    static #getAllRutinasLocalStorage() {
        const rutinas = JSON.parse(localStorage.getItem(YouTrain.LOCAL_STORAGE_DATA_KEY));
        let instances = [];

        if (rutinas) {
            rutinas.forEach((rutina) => {
                const { nombre, rondas, dias, items, created } = rutina;
                const instance = new Rutina(nombre, rondas, dias, items);
                instance.created = created; // para conservar fecha de creación de la rutina

                instances.push(instance);
            });
        } else {
            instances = [];
        }

        return instances;
    }

    static #saveRutinasLocalStorage(rutinas) {
        localStorage.setItem(YouTrain.LOCAL_STORAGE_DATA_KEY, JSON.stringify(rutinas));
    }
}
