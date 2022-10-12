import YouTrain from "./YouTrain.js";
import WorkoutGeneratorView from "./WorkoutGeneratorView.js";
import WorkoutGeneratorAPI from "./WorkoutGeneratorAPI.js";
import Rutina from "./Rutina.js";
import Ejercicio from "./Ejercicio.js";

export default class WorkoutGenerator {
    constructor(root) {
        this.rutina = null;
        this.ejercicios = [];

        this.ejercicios.push(
            new Ejercicio(1, "Pike Push-Ups", 3, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/pikepushups.png"),
            new Ejercicio(2, "Bicycle Crunches", 2, "Cardio", "Ninguno", "Abdomen", "./img/ejercicios/bicyclecrunches.png"),
            new Ejercicio(3, "Jumping Jacks", 1, "Cardio", "Ninguno", "Cuerpo Completo", "./img/ejercicios/jumpingjacks.png"),
            new Ejercicio(4, "Push-Ups", 2, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/pushups.png"),
            new Ejercicio(5, "Diamond Push-Ups", 3, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/diamondpushups.png"),
            new Ejercicio(6, "b Push-Ups", 3, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/diamondpushups.png"),
            new Ejercicio(7, "c Push-Ups", 3, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/diamondpushups.png"),
            new Ejercicio(8, "d Push-Ups", 3, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/diamondpushups.png"),
            new Ejercicio(9, "e Push-Ups", 3, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/diamondpushups.png"),
            new Ejercicio(10, "f Push-Ups", 3, "Fuerza", "Ninguno", "Brazos", "./img/ejercicios/diamondpushups.png")
        );

        this.view = new WorkoutGeneratorView(root, this.ejercicios, this.#handlers());
        this.#refreshAjustesRutina();
        this.#refreshRutinaList();
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
            onEditRutina: () => {},
            onDeleteItem: (itemId) => {
                WorkoutGeneratorAPI.deleteRutinaItem(itemId);
                this.#refreshRutinaList();
            },
            onSubmitRutina: (nombre, rondas, dias) => {
                const rutina = new Rutina();
                const items = [...this.rutina.items];

                rutina.nombre = nombre;
                rutina.items = [...items];
                rutina.rondas = rondas;
                rutina.dias = [...dias];
                rutina.date = new Date();
                rutina.duracion = rutina.calcularDuracion();
                rutina.calorias = rutina.calcularCalorias();

                this.rutina = { ...rutina };

                WorkoutGeneratorAPI.saveRutinaLocalStorage(this.rutina);

                // agrega rutina a db de rutinas del usuario
                YouTrain.addRutina(this.rutina);

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

                // borra rutina
                this.rutina = new Rutina();
                WorkoutGeneratorAPI.saveRutinaLocalStorage(this.rutina);
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
