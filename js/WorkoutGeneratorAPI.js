import Rutina from "./Rutina.js";
import YouTrain from "./YouTrain.js";

export default class WorkoutGeneratorAPI {
    static LOCAL_STORAGE_DATA_KEY = "workout-generator-rutina";

    static getRutinaLocalStorage() {
        const rutina = JSON.parse(localStorage.getItem(WorkoutGeneratorAPI.LOCAL_STORAGE_DATA_KEY)) || new Rutina();
        return rutina;
    }

    static saveRutinaLocalStorage(rutina) {
        localStorage.setItem(WorkoutGeneratorAPI.LOCAL_STORAGE_DATA_KEY, JSON.stringify(rutina));
    }

    static saveRutinaItem(ejercicio) {
        const rutina = this.getRutinaLocalStorage();

        // verifica si item a guardar existe en el local storage
        const existingItem = rutina.items.find((item) => ejercicio.id == item.id);

        if (!existingItem) {
            const newItem = {
                ...ejercicio,
                cantidad: 1,
            };
            rutina.items.push(newItem);
        } else {
            if (existingItem.cantidad < 60) {
                existingItem.cantidad += 1;
            }
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
