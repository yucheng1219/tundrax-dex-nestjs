import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { lowerCaseTransformer } from '~/utils/transformers'

export class CreateUserDto {
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string

  @IsNotEmpty()
  fullName: string

  @IsString()
  @MinLength(6)
  password: string
}
