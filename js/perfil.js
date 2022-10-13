import YouTrain from "./YouTrain.js";
import WorkoutGeneratorAPI from "./WorkoutGeneratorAPI.js";
import Rutina from "./Rutina.js";

const rutinas = YouTrain.getAllRutinasLocalStorage();

mostrarRutinas();

const addRutinaBtn = document.querySelector("#btn__add-rutina");
addRutinaBtn.addEventListener("click", () => {
    WorkoutGeneratorAPI.saveRutinaLocalStorage(new Rutina());
});

function mostrarRutinas() {
    const rutinasList = document.querySelector("#rutinas");

    for (const rutina of rutinas) {
        const template = document.createElement("template");
        template.innerHTML = `
            <a href="../index.html" class="list-group-item p-3">
                <h5>${rutina.nombre}</h5>
                <p class="m-0">Creada: ${new Date(rutina.created).toLocaleString()}</p>
            </a>
        `.trim();

        const rutinaListItem = template.content.firstChild;

        rutinasList.appendChild(rutinaListItem);

        rutinaListItem.addEventListener("click", () => {
            // set rutina actual para workout generator
            WorkoutGeneratorAPI.saveRutinaLocalStorage(rutina);
        });
    }
}
