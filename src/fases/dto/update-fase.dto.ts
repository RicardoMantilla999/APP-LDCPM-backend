import { PartialType } from '@nestjs/mapped-types';
import { CreateFaseDto } from './create-fase.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateFaseDto extends PartialType(CreateFaseDto) {

    @IsOptional()
    id?: number;
    
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    nombre?: string;

    @IsNotEmpty({ message: 'El orden es obligatorio' })
    @IsNumber()
    orden?: number;


    @IsNotEmpty({ message: 'Campeonato es obligatorio' })
    campeonato?: number;
    


}
