import { Module, forwardRef } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { Publisher } from './entities/publisher.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publisher]),
    AuthModule,
    forwardRef(() => BooksModule)
  ],
  controllers: [PublishersController],
  providers: [PublishersService],
  exports: [PublishersService]
})
export class PublishersModule {}
