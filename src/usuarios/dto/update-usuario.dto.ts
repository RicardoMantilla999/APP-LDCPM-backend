import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {

    @IsOptional()
    id?: number;

    @IsString()
    @MinLength(1)
    @IsOptional()
    username?: string;

    @IsString()
    @MinLength(5)
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    id_rol?: string;

}
