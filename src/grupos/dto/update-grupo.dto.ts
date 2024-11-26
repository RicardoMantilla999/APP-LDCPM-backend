import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoDto } from './create-grupo.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateGrupoDto extends PartialType(CreateGrupoDto) {

    @IsOptional()
    id?: number;

    @IsNotEmpty({message:'El nombre es obligatorio'})
    nombre?: string;

    @IsNotEmpty({message: "La Fase es obligatoria"})
    fase?: number;

    

}
