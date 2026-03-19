import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, Matches } from 'class-validator';

export class UpdateUserInput {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z]+$/, { message: 'Name must contain only English letters' })
  name: string;

  @IsNotEmpty()
  @IsString()
  hashedRT: string;
}
