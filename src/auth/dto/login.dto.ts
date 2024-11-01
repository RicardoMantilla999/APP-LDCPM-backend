import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto{

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    username: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @IsNotEmpty()
    password: string;

}