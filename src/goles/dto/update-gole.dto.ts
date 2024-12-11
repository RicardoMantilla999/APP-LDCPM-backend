import { PartialType } from '@nestjs/mapped-types';
import { CreateGoleDto } from './create-gole.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateGoleDto extends PartialType(CreateGoleDto) {

    @IsNumber()
    @IsOptional()
    goles?: number;

    @IsNumber()
    @IsOptional()
    jugadorId?: number;

    @IsNumber()
    @IsOptional()
    partidoId?: number;

    @IsNumber()
    @IsOptional()
    equipoId?: number;

}
