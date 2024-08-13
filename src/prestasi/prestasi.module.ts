import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Prestasi } from 'src/entities/prestasi.entity';
import { PrestasiService } from './prestasi.service';
import { PrestasiController } from './prestasi.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prestasi]), AuthModule],
  controllers: [PrestasiController],
  providers: [PrestasiService]
})
export class PrestasiModule {}