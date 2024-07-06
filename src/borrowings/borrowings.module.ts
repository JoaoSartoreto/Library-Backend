import { Module } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { BorrowingsController } from './borrowings.controller';
import { Borrowing } from './entities/borrowing.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { LibraryConfigurationsModule } from 'src/library-configurations/library-configurations.module';
import { FinesModule } from 'src/fines/fines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrowing, User, Book]),
    AuthModule,
    UsersModule,
    BooksModule,
    FinesModule,
    LibraryConfigurationsModule
  ],
  controllers: [BorrowingsController],
  providers: [BorrowingsService]
})
export class BorrowingsModule {}
