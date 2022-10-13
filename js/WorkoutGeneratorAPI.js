import Rutina from "./Rutina.js";

export default class WorkoutGeneratorAPI {
    static LOCAL_STORAGE_DATA_KEY = "workout-generator-rutina";

    static async fetchEjercicios() {
        try {
            const response = await fetch("./ejercicios.json");
            return await response.json();
        } catch (error) {
            console.error("fetch error");
        }
    }

    static getRutinaLocalStorage() {
        const rutina = JSON.parse(localStorage.getItem(WorkoutGeneratorAPI.LOCAL_STORAGE_DATA_KEY));
        let instance = null;

        if (rutina) {
            const { nombre, rondas, dias, items } = rutina;
            instance = new Rutina(nombre, rondas, dias, items);
        } else {
            instance = new Rutina();
        }

        return instance;
    }

    static saveRutinaLocalStorage(rutina) {
        localStorage.setItem(WorkoutGeneratorAPI.LOCAL_STORAGE_DATA_KEY, JSON.stringify(rutina));
    }

    static saveRutinaItem(ejercicio) {
        const rutina = WorkoutGeneratorAPI.getRutinaLocalStorage();

        // verifica si item a guardar existe en el local storage
        const existing = rutina.items.find((item) => ejercicio.id == item.id);

        if (existing) {
            if (existing.cantidad < 60) {
                existing.cantidad++;
            }
        } else {
            rutina.items.push({
                ...ejercicio,
                cantidad: 1,
            });
        }

        WorkoutGeneratorAPI.saveRutinaLocalStorage(rutina);
    }

    static editRutinaItem(itemId, cantidad) {
        const rutina = WorkoutGeneratorAPI.getRutinaLocalStorage();
        const existing = rutina.items.find((item) => item.id == itemId);

        existing.cantidad = Number(cantidad);

        WorkoutGeneratorAPI.saveRutinaLocalStorage(rutina);
    }

    static deleteRutinaItem(itemId) {
        const rutina = WorkoutGeneratorAPI.getRutinaLocalStorage();

        // obtiene todos los items que no tengan el id
        const newItems = rutina.items.filter((item) => item.id != itemId);

        const newRutina = {
            ...rutina,
            items: [...newItems],
        };

        WorkoutGeneratorAPI.saveRutinaLocalStorage(newRutina);
    }

    static deleteAllRutinaItems() {
        const rutina = WorkoutGeneratorAPI.getRutinaLocalStorage();
        rutina.items = [];
        WorkoutGeneratorAPI.saveRutinaLocalStorage();
    }
}
