import YouTrain from "./YouTrain.js";
import WorkoutGeneratorAPI from "./WorkoutGeneratorAPI.js";
import WorkoutGeneratorView from "./WorkoutGeneratorView.js";
import Rutina from "./Rutina.js";
import Ejercicio from "./Ejercicio.js";

export default class WorkoutGenerator {
    constructor(root) {
        this.rutina = null;
        this.ejercicios = [];

        WorkoutGeneratorAPI.fetchEjercicios()
            .then((ejercicios) => {
                const instances = [];
                ejercicios.forEach((ejercicio) => {
                    const { id, nombre, dificultad, categoria, material, enfoque, img } = ejercicio;
                    const instance = new Ejercicio(id, nombre, dificultad, categoria, material, enfoque, img);
                    instances.push(instance);
                });

                this.ejercicios = [...instances];
                this.view = new WorkoutGeneratorView(root, this.ejercicios, this.#handlers());
                this.#refreshAjustesRutina();
                this.#refreshRutinaList();
            });
    }

    #refreshAjustesRutina() {
        this.rutina = WorkoutGeneratorAPI.getRutinaLocalStorage();
        this.view.renderAjustesRutina(this.rutina);
    }

    #refreshRutinaList() {
        this.rutina = WorkoutGeneratorAPI.getRutinaLocalStorage();
        this.view.renderRutinaList(this.rutina);
    }

    #handlers() {
        return {
            onAddItem: (ejercicioId) => {
                // verifica que exista en los ejercicios disponibles
                const existing = this.ejercicios.find((ejercicio) => ejercicioId == ejercicio.id);

                if (existing) {
                    WorkoutGeneratorAPI.saveRutinaItem(existing);
                    this.#refreshRutinaList();
                }
            },
            onEditItem: (itemId, cantidad) => {
                WorkoutGeneratorAPI.editRutinaItem(itemId, cantidad);
                this.#refreshRutinaList();
            },
            onDeleteItem: (itemId) => {
                WorkoutGeneratorAPI.deleteRutinaItem(itemId);
                this.#refreshRutinaList();
            },
            onSubmitRutina: (nombre, rondas, dias) => {
                const instance = new Rutina(nombre, rondas, dias, this.rutina.items);
                this.rutina = {...instance};

                WorkoutGeneratorAPI.saveRutinaLocalStorage(this.rutina);

                // agrega rutina a db de rutinas del usuario
                YouTrain.saveRutina(this.rutina);

                // toast: rutina creada
                Toastify({
                    text: "Rutina guardada exitosamente",
                    duration: 5000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                }).showToast();

                // redirecciona a pagina mi perfil
                //window.location.href = "./pages/profile.html";
            },
            onChangeOrderRutina: (orderedIds) => {
                const orderedItems = [];
                orderedIds.forEach((itemId) => {
                    const item = this.rutina.items.find((rutinaItem) => itemId == rutinaItem.id);

                    orderedItems.push(item);
                });

                this.rutina.items = [...orderedItems];
                WorkoutGeneratorAPI.saveRutinaLocalStorage(this.rutina);
                this.#refreshRutinaList();
            },
            onEraseRutina: () => {
                this.rutina = new Rutina();
                WorkoutGeneratorAPI.saveRutinaLocalStorage(this.rutina);
                this.#refreshRutinaList();
                this.#refreshAjustesRutina();
            },
        };
    }
}
