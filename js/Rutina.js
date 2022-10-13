export default class Rutina {
    constructor(nombre, rondas, dias, items) {
        this.nombre = nombre ? nombre : "";
        this.rondas = rondas ? Number(rondas) : 1;
        this.dias = dias ? dias : [];
        this.items = items ? items : [];
        this.duracion = this.calcularDuracion();
        this.calorias = this.calcularCalorias();
        this.created = new Date();
    }

    calcularDuracion() {
        return this.items.length * this.rondas;
    }

    calcularCalorias() {
        return 0;
    }
}
