import Rutina from "./Rutina.js";
import WorkoutGenerator from "./WorkoutGenerator.js";

export default class YouTrain {
    static LOCAL_STORAGE_DATA_KEY = "youtrain-rutinas";

    constructor(root) {
        this.root = root;
        this.usuario = null;
        this.rutinas = YouTrain.getAllRutinasLocalStorage();

        const appRoot = root.querySelector("#app");
        const wg = new WorkoutGenerator(appRoot);
    }

    static addRutina(rutinaToSave) {
        const rutinas = this.getAllRutinasLocalStorage();

        // verifica si la rutina a guardar existe en el local storage
        const existing = rutinas.find((r) => r.nombre == rutinaToSave.nombre);

        if (existing) {
            const { nombre, items, rondas, dias } = rutinaToSave;
            const newRutina = new Rutina(nombre, items, rondas, dias);

            existing.nombre = nombre;
            existing.items = [...items];
            existing.rondas = rondas;
            existing.dias = [...dias];
            existing.duracion = newRutina.calcularDuracion();
            existing.calorias = newRutina.calcularCalorias();
        } else {
            rutinas.push(rutinaToSave);
        }
        YouTrain.saveRutinasLocalStorage(rutinas);
    }

    static getAllRutinasLocalStorage() {
        return JSON.parse(localStorage.getItem(YouTrain.LOCAL_STORAGE_DATA_KEY)) || [];
    }

    static saveRutinasLocalStorage(rutinas) {
        localStorage.setItem(YouTrain.LOCAL_STORAGE_DATA_KEY, JSON.stringify(rutinas));
    }
}
