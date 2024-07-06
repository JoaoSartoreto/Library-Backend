import { Module } from '@nestjs/common';
import { BibliographiesService } from './bibliographies.service';
import { BibliographiesController } from './bibliographies.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Bibliography } from './entities/bibliography.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bibliography]), AuthModule, BooksModule],
  controllers: [BibliographiesController],
  providers: [BibliographiesService]
})
export class BibliographiesModule {}
