import { IsNotEmpty, Length } from 'class-validator';

export class AuthLoginInput {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @Length(8)
    password: string;
}
