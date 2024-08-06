import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Pekerjaan } from 'src/entities/pekerjaan.entity';
import { PekerjaanController } from './pekerjaan.controller';
import { PekerjaanService } from './pekerjaan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pekerjaan]), AuthModule],
  controllers: [PekerjaanController],
  providers: [PekerjaanService]
})
export class PekerjaanModule {}