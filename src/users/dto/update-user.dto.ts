import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'
import { Role } from '~/common/decorators/roles.decorator'

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName?: string

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string

  @IsString()
  @IsEnum(Role)
  @IsOptional()
  role?: Role
}
