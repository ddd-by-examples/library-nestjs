import { Result } from '@library/shared/domain';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Catalogue } from './catalogue';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly catalogue: Catalogue) {}

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<Result> {
    await this.catalogue.addBook(
      createBookDto.author,
      createBookDto.title,
      createBookDto.isbn
    );
    return this.catalogue.addBookInstance(
      createBookDto.isbn,
      createBookDto.bookType
    );
  }

  @Get()
  findAll() {
    return this.catalogue.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogue.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.catalogue.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogue.remove(+id);
  }
}
