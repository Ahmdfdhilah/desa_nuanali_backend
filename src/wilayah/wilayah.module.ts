import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Wilayah } from 'src/entities/wilayah.entity';
import { WilayahController } from './wilayah.controller';
import { WilayahService } from './wilayah.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wilayah]), AuthModule],
  controllers: [WilayahController],
  providers: [WilayahService]
})
export class WilayahModule {}