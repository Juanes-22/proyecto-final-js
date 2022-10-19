import YouTrain from "./YouTrain.js";
import WorkoutGeneratorAPI from "./WorkoutGeneratorAPI.js";
import Rutina from "./Rutina.js";

let rutinas = [];

getAllRutinasLocalStorage();
mostrarRutinas();

const addRutinaBtn = document.querySelector("#btn__add-rutina");
addRutinaBtn.addEventListener("click", () => {
    WorkoutGeneratorAPI.saveRutinaLocalStorage(new Rutina());
});

function getAllRutinasLocalStorage() {
    rutinas = YouTrain.getAllRutinasLocalStorage();
}

function mostrarRutinas() {
    const rutinasList = document.querySelector("#rutinas");

    rutinasList.innerHTML = "";

    for (const rutina of rutinas) {
        const template = document.createElement("template");
        template.innerHTML = `
            <div class="list-group-item p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <a href="../index.html">
                        <h5>${rutina.nombre}</h5>
                        <p class="m-0">Creada: ${new Date(rutina.created).toLocaleString()}</p>
                    </a href="../index.html">
                    <button type="button" class="btn btn-light btn__delete-rutina">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `.trim();

        const rutinaListItem = template.content.firstChild;
        rutinasList.appendChild(rutinaListItem);

        const rutinaDeleteBtn = rutinaListItem.querySelector(".btn__delete-rutina");
        rutinaDeleteBtn.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres borrar la rutina?")) {
                YouTrain.deleteRutina(rutina);
                getAllRutinasLocalStorage();
                mostrarRutinas();
            }
        });

        rutinaListItem.addEventListener("click", () => {
            // set rutina actual para workout generator
            WorkoutGeneratorAPI.saveRutinaLocalStorage(rutina);
        });
    }
}
