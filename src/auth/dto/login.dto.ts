import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto{

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    email: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    password: string;

}