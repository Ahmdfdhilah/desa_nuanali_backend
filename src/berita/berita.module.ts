import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Berita } from 'src/entities/berita.entity';
import { BeritaController } from './berita.controller';
import { BeritaService } from './berita.service';

@Module({
  imports: [TypeOrmModule.forFeature([Berita]), AuthModule],
  controllers: [BeritaController],
  providers: [BeritaService]
})
export class BeritaModule {}