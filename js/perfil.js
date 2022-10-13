import WorkoutGeneratorAPI from "./WorkoutGeneratorAPI.js";
import Rutina from "./Rutina.js";

const LOCAL_STORAGE_DATA_KEY = "youtrain-rutinas";

const rutinas = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DATA_KEY)) || [];

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
        WorkoutGeneratorAPI.saveRutinaLocalStorage(rutina);
    });
}

const addRutinaBtn = document.querySelector("#btn__add-rutina");

addRutinaBtn.addEventListener("click", () => {
    WorkoutGeneratorAPI.saveRutinaLocalStorage(new Rutina());
});
