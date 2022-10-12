export default class Rutina {
    constructor(nombre, items, rondas, dias) {
        this.nombre = nombre ? nombre : "";
        this.items = items ? items : [];
        this.rondas = rondas ? rondas : 1;
        this.dias = dias ? dias : [];
        this.duracion = 0;
        this.calorias = 0;
        this.date = null;
    }

    calcularDuracion() {
        return this.items.length * this.rondas;
    }

    calcularCalorias() {
        return 0;
    }
}
