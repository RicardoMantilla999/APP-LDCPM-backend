export interface JugadorTarjetas {
    nombres: string;
    apellidos: string;
    fechas: { [key: string]: string };
}

export interface Resultado {
    [jugadorId: number]: JugadorTarjetas;
}