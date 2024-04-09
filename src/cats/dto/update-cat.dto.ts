import { IsOptional, IsString } from 'class-validator'

export class UpdateCatDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly age?: number

  @IsString()
  @IsOptional()
  readonly breed?: string
}
