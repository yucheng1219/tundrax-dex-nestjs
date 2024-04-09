import type { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import { BadRequestException, Injectable } from '@nestjs/common'

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
  async transform(value: string, _metadata: ArgumentMetadata) {
    const val = parseInt(value, 10)
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed')
    }
    return val
  }
}
