import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { DanaDesa } from 'src/entities/dana-desa.entity';
import { DanaDesaController } from './dana-desa.controller';
import { DanaDesaService } from './dana-desa.service';

@Module({
  imports: [TypeOrmModule.forFeature([DanaDesa]), AuthModule],
  controllers: [DanaDesaController],
  providers: [DanaDesaService]
})
export class DanaDesaModule {}