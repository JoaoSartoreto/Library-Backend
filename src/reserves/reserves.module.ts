import { Module, forwardRef } from '@nestjs/common';
import { ReservesService } from './reserves.service';
import { ReservesController } from './reserves.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Reserve } from './entities/reserve.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { UsersModule } from 'src/users/users.module';
import { BooksModule } from 'src/books/books.module';
import { LibraryConfigurationsModule } from 'src/library-configurations/library-configurations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserve, User, Book]),
    AuthModule,
    UsersModule,
    forwardRef(() => BooksModule),
    LibraryConfigurationsModule
  ],
  controllers: [ReservesController],
  providers: [ReservesService],
  exports: [ReservesService]
})
export class ReservesModule {}
