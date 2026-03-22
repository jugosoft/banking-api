import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class AuthRegisterInput {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(8)
    password: string;
}
