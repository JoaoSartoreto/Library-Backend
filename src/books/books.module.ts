import { Module, forwardRef } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from 'src/authors/authors.module';
import { TagsModule } from 'src/tags/tags.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { PublishersModule } from 'src/publishers/publishers.module';
import { ReservesModule } from 'src/reserves/reserves.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    AuthModule,
    forwardRef(() => AuthorsModule),
    forwardRef(() => TagsModule),
    forwardRef(() => CategoriesModule),
    forwardRef(() => PublishersModule),
    forwardRef(() => ReservesModule)
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService]
})
export class BooksModule {}
