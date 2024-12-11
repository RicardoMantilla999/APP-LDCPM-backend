import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGoleDto {

    @IsNumber()
    @IsNotEmpty({ message: 'Nro de Goles es obligatorio' })
    goles: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El Jugador es obligatorio' })
    jugadorId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El Partido es obligatorio' })
    partidoId: number;

    @IsNumber()
    @IsNotEmpty({ message: 'El Equipo es obligatorio' })
    equipoId: number;

}
