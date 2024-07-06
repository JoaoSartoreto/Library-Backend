import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validate } from './env.validation';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { LibraryConfiguration } from './library-configurations/entities/library-configuration.entity';
import { LibraryConfigurationsModule } from './library-configurations/library-configurations.module';
import { AuthorsModule } from './authors/authors.module';
import { Author } from './authors/entities/author.entity';
import { TagsModule } from './tags/tags.module';
import { Tag } from './tags/entities/tag.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { PublishersModule } from './publishers/publishers.module';
import { Publisher } from './publishers/entities/publisher.entity';
import { BooksModule } from './books/books.module';
import { Book } from './books/entities/book.entity';
import { BibliographiesModule } from './bibliographies/bibliographies.module';
import { Bibliography } from './bibliographies/entities/bibliography.entity';
import { ReservesModule } from './reserves/reserves.module';
import { Reserve } from './reserves/entities/reserve.entity';
import { BorrowingsModule } from './borrowings/borrowings.module';
import { Borrowing } from './borrowings/entities/borrowing.entity';
import { FinesModule } from './fines/fines.module';
import { Fine } from './fines/entities/fine.entity';
import { LibraryConfigurationsService } from './library-configurations/library-configurations.service';

@Module({
  imports: [
    ConfigModule.forRoot({ validate, isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          User,
          LibraryConfiguration,
          Author,
          Tag,
          Category,
          Publisher,
          Book,
          Bibliography,
          Reserve,
          Borrowing,
          Fine
        ],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    LibraryConfigurationsModule,
    AuthorsModule,
    TagsModule,
    CategoriesModule,
    PublishersModule,
    BooksModule,
    BibliographiesModule,
    ReservesModule,
    BorrowingsModule,
    FinesModule
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }]
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private readonly libraryConfigurationService: LibraryConfigurationsService
  ) {}

  async onApplicationBootstrap() {
    await this.libraryConfigurationService.initialize();
  }
}
