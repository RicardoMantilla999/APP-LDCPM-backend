import { PartialType } from '@nestjs/mapped-types';
import { CreatePosicioneDto } from './create-posicione.dto';
import { IsNumber } from 'class-validator';

export class UpdatePosicioneDto extends PartialType(CreatePosicioneDto) {

    @IsNumber()
    equipoId: number;

    @IsNumber()
    categoriaId: number;

    @IsNumber()
    faseId: number;

    @IsNumber()
    golesFavor: number;

    @IsNumber()
    golesContra: number;

}
