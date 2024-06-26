import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { lowerCaseTransformer } from '~/utils/transformers'

export class AuthEmailLoginDto {
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  password: string
}
