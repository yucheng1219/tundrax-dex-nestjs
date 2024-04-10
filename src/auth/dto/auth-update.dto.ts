import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class AuthUpdateDto {
  @IsNotEmpty()
  @IsOptional()
  fullName?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password?: string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  oldPassword?: string
}
