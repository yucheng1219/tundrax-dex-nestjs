import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateCatDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsInt()
  readonly age: number

  @IsString()
  @IsNotEmpty()
  readonly breed: string
}
