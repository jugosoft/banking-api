import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class DepositTypeRequestDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  depositGroupId?: number;
}
