import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { lowerCaseTransformer } from '~/utils/transformers'

export class AuthRegisterLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string

  @MinLength(8)
  password: string

  @IsString()
  @IsNotEmpty()
  fullName: string
}
