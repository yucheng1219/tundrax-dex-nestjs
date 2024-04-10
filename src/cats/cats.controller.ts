import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Role, Roles } from '~/common/decorators/roles.decorator'
import { RolesGuard } from '~/common/guards/roles.guard'
import { ParseIntPipe } from '~/common/pipes/parse-int.pipe'
import { CatsService } from './cats.service'
import { CreateCatDto, UpdateCatDto } from './dto'
import type { Cat } from './interfaces/cat.interface'

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCatDto: CreateCatDto) {
    return this.catsService.create(createCatDto)
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll()
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseIntPipe())
    id: number
  ) {
    const result = await this.catsService.findOne(id)
    if (!result) {
      throw new HttpException('notFound', HttpStatus.NOT_FOUND)
    }
    return result
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateOne(
    @Param('id', new ParseIntPipe())
    id: number,
    @Body() updateCatDto: UpdateCatDto
  ) {
    return this.catsService.update(id, updateCatDto)
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOne(
    @Param('id', new ParseIntPipe())
    id: number
  ) {
    return this.catsService.deleteOne(id)
  }
}
