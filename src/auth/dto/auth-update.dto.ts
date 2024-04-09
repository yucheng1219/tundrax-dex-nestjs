import { IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class AuthUpdateDto {
  @IsNotEmpty()
  @IsOptional()
  fullName?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword?: string;
}
