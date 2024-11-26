import { PartialType } from '@nestjs/mapped-types';
import { CreateSorteoDto } from './create-sorteo.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSorteoDto extends PartialType(CreateSorteoDto) {

    @IsNotEmpty({message: 'equipo obligatorio'})
    @IsNumber()
    equipo?: number;

    @IsNotEmpty({message: 'nro sorteo obligatorio'})
    @IsNumber()
    nro_sorteo?: number;

    @IsNotEmpty({message: 'categoria obligatoria'})
    @IsNumber()
    categoria?: number;

}
