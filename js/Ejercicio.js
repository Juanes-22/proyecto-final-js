export default class Ejercicio {
    constructor(id, nombre, dificultad, categoria, material, enfoque, img = "...") {
        this.id = id;
        this.nombre = nombre;
        this.dificultad = dificultad;
        this.categoria = categoria;
        this.material = material;
        this.enfoque = enfoque;
        this.img = img;
    }

    getHTMLElement() {
        const template = document.createElement("template");

        template.innerHTML = `
            <div class="col mt-3">
                <div class="card h-100 text-white bg-dark" data-ejercicio-id="${this.id}">
                    <img src="${this.img}" class="card-img-top" alt="Ejercicio" />

                    <div class="card-body">
                        <h5 class="card-title my-2">${this.nombre}</h5>

                        <span class="badge rounded-pill badge-info">${this.categoria}</span>
                        <span class="badge rounded-pill badge-secondary">${this.enfoque}</span>
                        <span class="badge rounded-pill badge-success">${this.material}</span>

                        <ul class="list-inline card-stats my-2"></ul>
                    </div>
                </div>
            </div>
        `.trim();

        const card = template.content.firstElementChild;

        const iconsList = card.querySelector(".card-stats");
        const iconListItemTemplate = document.createElement("template");

        iconListItemTemplate.innerHTML = `
            <li class="list-inline-item">
                <i class="fas fa-fire mx-1"></i>
            </li>
        `;

        const icon = iconListItemTemplate.content.firstElementChild;

        for (let i = 0; i < this.dificultad; i++) {
            const iconClonado = icon.cloneNode(true);

            iconsList.appendChild(iconClonado);
        }

        return card;
    }
}
