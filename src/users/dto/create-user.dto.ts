import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'
import { lowerCaseTransformer } from '~/utils/transformers'

export class CreateUserDto {
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string

  @IsNotEmpty()
  fullName: string

  @MinLength(8)
  password: string
}
