import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Lapak } from 'src/entities/lapak.entity';
import { LapakController } from './lapak.controller';
import { LapakService } from './lapak.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lapak]), AuthModule],
  controllers: [LapakController],
  providers: [LapakService]
})
export class LapakModule {}