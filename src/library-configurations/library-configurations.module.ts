import { Module } from '@nestjs/common';
import { LibraryConfigurationsService } from './library-configurations.service';
import { LibraryConfigurationsController } from './library-configurations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryConfiguration } from './entities/library-configuration.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([LibraryConfiguration]), AuthModule],
  controllers: [LibraryConfigurationsController],
  providers: [LibraryConfigurationsService],
  exports: [LibraryConfigurationsService]
})
export class LibraryConfigurationsModule {}
