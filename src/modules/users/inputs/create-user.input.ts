import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z]+$/, { message: 'Name must contain only English letters' })
  name: string;

  @IsNotEmpty()
  @Length(8)
  password: string;
}
