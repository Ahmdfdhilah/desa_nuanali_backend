import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Pembangunan } from 'src/entities/pembangunan.entity';
import { PembangunanController } from './pembangunan.controller';
import { PembangunanService } from './pembangunan.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pembangunan]), AuthModule],
  controllers: [PembangunanController],
  providers: [PembangunanService]
})
export class PembangunanModule {}