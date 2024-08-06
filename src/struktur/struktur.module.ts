import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Struktur } from 'src/entities/struktur.entity';
import { StrukturController } from './struktur.controller';
import { StrukturService } from './struktur.service';

@Module({
  imports: [TypeOrmModule.forFeature([Struktur]), AuthModule],
  controllers: [StrukturController],
  providers: [StrukturService]
})
export class StrukturModule {}