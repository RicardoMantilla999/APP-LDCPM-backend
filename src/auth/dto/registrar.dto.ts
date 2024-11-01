import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegistrarDto{

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    username: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsString()
    @IsOptional()
    rol: string = 'user';

}