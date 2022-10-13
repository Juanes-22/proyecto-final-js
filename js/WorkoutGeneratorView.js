export default class WorkoutGeneratorView {
    constructor(root, ejercicios, { onAddItem, onEditItem, onDeleteItem, onChangeOrderRutina, onEraseRutina, onSubmitRutina } = {}) {
        this.root = root;

        this.onAddItem = onAddItem;
        this.onEditItem = onEditItem;
        this.onDeleteItem = onDeleteItem;
        this.onChangeOrderRutina = onChangeOrderRutina;
        this.onEraseRutina = onEraseRutina;
        this.onSubmitRutina = onSubmitRutina;

        this.root.innerHTML = `
            <div class="container">
                <!-- Header aplicación -->
                <div class="row">
                    <h1 class="mb-5">Crear mi rutina</h1>
                </div>

                <!-- Cuerpo aplicación -->
                <div class="row">
                    <!-- Sidebar creacion rutina -->
                    <div class="col-lg-4 p-4 mb-5 mb-lg-0" id="workoutGenerator__sidebar">${this.#getRutinaFormHTML()}</div>

                    <!-- Sección ejercicios disponibles -->
                    <div class="col-lg-8 px-5" id="workoutGenerator__ejercicios">                        
                        <!-- Buscador de ejercicios -->
                        <div class="row my-4" id="ejercicios__buscador">
                            <div class="col">
                                <div class="input-group">
                                    <input type="search" class="form-control rounded-pill" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
                                    <span class="input-group-text border-0" id="search-addon"><i class="fas fa-search"></i></span>
                                </div>
                            </div>
                        </div>
            
                        <!-- Ejercicios disponibles -->
                        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 overflow-auto" id="ejercicios__container"></div>
                    </div>
                </div>
            </div>
        `;

        this.renderEjercicios(ejercicios);

        // libreria SortableJS
        this.#sortableRutina();

        // evento submit rutina
        const rutinaForm = document.querySelector("#rutina-form");
        rutinaForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const { nombre, rondas } = Object.fromEntries(new FormData(e.target));

            const checked = rutinaForm.querySelectorAll(".rutina-form__day:checked");
            const diasChecked = [...checked].map((checkbox) => checkbox.value);

            diasChecked.forEach((dia, index) => {
                diasChecked[index] = dia.replace("weekday-", "");
            });

            this.onSubmitRutina(nombre, rondas, diasChecked);
        });

        // evento cambio value de slider
        const slider = this.root.querySelector("#rutina-form__rondas-slider");
        const rondasValue = this.root.querySelector("#rutina-form__rondas-value");
        slider.oninput = () => {
            rondasValue.innerText = slider.value;
        };

        // evento borrar todo rutina
        const btnEraseAll = this.root.querySelector("#rutina-form__erase");
        btnEraseAll.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres borrar la rutina?")) {
                this.onEraseRutina();
            }
        });
    }

    renderEjercicios(ejercicios) {
        const ejerciciosContainer = document.querySelector("#ejercicios__container");

        for (const ejercicio of ejercicios) {
            const ejercicioElement = ejercicio.getHTMLElement();
            const card = ejercicioElement.querySelector(".card");

            card.addEventListener("click", () => {
                this.onAddItem(card.dataset.ejercicioId);
            });

            card.addEventListener("mouseenter", (e) => {
                const img = e.target.getElementsByTagName("img");
                const prevSrc = img[0].src;
                const newSrc = prevSrc.replace("png", "gif");

                img[0].src = newSrc;
            });

            card.addEventListener("mouseleave", (e) => {
                const img = e.target.getElementsByTagName("img");
                const prevSrc = img[0].src;
                const newSrc = prevSrc.replace("gif", "png");

                img[0].src = newSrc;
            });

            ejerciciosContainer.appendChild(ejercicioElement);
        }
    }

    renderAjustesRutina(rutina) {
        const { nombre, rondas, dias } = rutina;

        /* Nombre rutina */
        const rutinaNombre = document.querySelector("#rutina-form__nombre");
        rutinaNombre.value = nombre;

        /* Opciones rutina */
        const rutinaRondas = document.querySelector("#rutina-form__rondas-value");
        rutinaRondas.innerText = rondas;

        const rutinaSlider = document.querySelector("#rutina-form__rondas-slider");
        rutinaSlider.value = rondas;

        const rutinaCheckBoxes = document.querySelectorAll(".rutina-form__day");
        rutinaCheckBoxes.forEach((checkbox) => {
            checkbox.checked = false;
            dias.forEach((dia) => {
                if (checkbox.value.includes(dia)) {
                    checkbox.checked = true;
                }
            });
        });
    }

    renderRutinaList(rutina) {
        const { items } = rutina;

        /* Rutina list */
        const rutinaList = document.querySelector("#rutina-form__list");

        // borra todos los rutina item
        rutinaList.querySelectorAll(".rutina-item").forEach((rutinaItem) => {
            rutinaItem.remove();
        });

        // renderiza cada rutina item
        for (const item of items) {
            const template = document.createElement("template");
            template.innerHTML = this.#createRutinaItemHTML(item).trim();

            const rutinaItem = template.content.firstElementChild;

            rutinaList.appendChild(rutinaItem);
        }

        // eventos para cada rutina item
        const rutinaItems = rutinaList.querySelectorAll(".rutina-item");
        rutinaItems.forEach((rutinaItem) => {
            // evento borrar item
            rutinaItem.querySelector(".rutina-item__delete").addEventListener("click", () => {
                this.onDeleteItem(rutinaItem.dataset.rutinaitemId);
            });

            // evento cambiar cantidad
            rutinaItem.querySelector(".rutina-item__cantidad").addEventListener("blur", (e) => {
                const id = rutinaItem.dataset.rutinaitemId;
                const cantidad = e.target.value;
                this.onEditItem(id, cantidad);
            });
        });
    }

    #getRutinaFormHTML() {
        return `
            <!-- Formulario rutina -->
            <form class="row" id="rutina-form">
                <!-- Título de rutina -->
                <div class="row">
                    <div class="col">
                        <input id="rutina-form__nombre" type="text" name="nombre" placeholder="Rutina..." required />
                        <hr />
                    </div>
                </div>

                <!-- Rutina list -->
                <div class="row mt-4">
                    <div class="col">
                        <ul class="list-group list-group-light list-group-small" id="rutina-form__list"></ul>
                    </div>
                </div>

                <!-- Opciones rutina -->
                <div class="row mt-5">
                    <!-- Slider -->
                    <label class="form-label" for="rutina-form__rondas-slider">
                        <h6>Número de rondas: <span id="rutina-form__rondas-value">3</span></h6>
                    </label>

                    <div class="range my-3">
                        <input type="range" name="rondas" class="form-range" min="1" max="6" value="3" id="rutina-form__rondas-slider" />
                    </div>

                    <!-- Checkboxes -->
                    <label class="form-label">
                        <h6>Días de la semana:</h6>
                    </label>

                    <div class="ms-3">
                        <div class="form-check mb-2">
                            <input class="form-check-input rutina-form__day" type="checkbox" value="weekday-mon" id="rutina-form__weekday-mon" />
                            <label class="form-check-label" for="rutina-form__weekday-mon">Lunes</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input rutina-form__day" type="checkbox" value="weekday-tue" id="rutina-form__weekday-tue" />
                            <label class="form-check-label" for="rutina-form__weekday-tue">Martes</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input rutina-form__day" type="checkbox" value="weekday-wed" id="rutina-form__weekday-wed" />
                            <label class="form-check-label" for="rutina-form__weekday-wed">Miércoles</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input rutina-form__day" type="checkbox" value="weekday-thu" id="rutina-form__weekday-thu" />
                            <label class="form-check-label" for="rutina-form__weekday-thu">Jueves</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input rutina-form__day" type="checkbox" value="weekday-fri" id="rutina-form__weekday-fri" />
                            <label class="form-check-label" for="rutina-form__weekday-fri">Viernes</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input rutina-form__day" type="checkbox" value="weekday-sat" id="rutina-form__weekday-sat" />
                            <label class="form-check-label" for="rutina-form__weekday-sat">Sábado</label>
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input rutina-form__day" type="checkbox" value="weekday-sun" id="rutina-form__weekday-sun" />
                            <label class="form-check-label" for="rutina-form__weekday-sun">Domingo</label>
                        </div>
                    </div>

                    <!-- Botones -->
                    <button type="submit" class="btn btn-success mt-5 mb-2" id="rutina-form__save">Guardar</button>
                    <button type="button" class="btn btn-dark my-2" id="rutina-form__erase">Borrar</button>
                </div>
            </form>        
        `;
    }

    #createRutinaItemHTML(item) {
        const { id, nombre, cantidad } = item;

        return `
            <li class="list-group-item px-3 rounded-3 list-group-item-light mb-2 d-flex justify-content-between align-items-center rutina-item" data-rutinaItem-id="${id}">
                <div class="d-flex align-items-center">
                    <i class="fas fa-grip-lines me-3"></i>
                    <div>
                        <h6 class="fw-bold mb-2 rutina-item__nombre">${nombre}</h6>                    
                        <input type="number" min="1" max="60" class="form-control rutina-item__cantidad" value="${cantidad}"/>                    
                    </div>
                </div>

                <div>
                    <button class="btn btn-dark btn-sm mx-1 rutina-item__delete" type="button" title="Delete"><i class="fa fa-trash"></i></button>
                </div>
            </li>
        `;
    }

    #sortableRutina() {
        const rutinaList = document.querySelector("#rutina-form__list");

        Sortable.create(rutinaList, {
            animation: 200,
            easing: "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
            handle: ".fas",
            chosenClass: "seleccionado",
            dragClass: "drag",
            group: "orden-rutina",
            dataIdAttr: "data-rutinaItem-id",
            onEnd: () => {
                const orderedIds = [];

                const rutinaItems = document.querySelectorAll(".rutina-item");
                rutinaItems.forEach((item) => {
                    const itemId = item.attributes["data-rutinaItem-id"].nodeValue;
                    orderedIds.push(itemId);
                });

                this.onChangeOrderRutina(orderedIds);
            },
        });
    }
}
