import { Transform } from "class-transformer";
import { IsOptional, IsString, MinLength } from "class-validator";

export class RegistrarDto{

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    username: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(5)
    password: string;

    @IsString()
    @IsOptional()
    rol: string = 'user';

}