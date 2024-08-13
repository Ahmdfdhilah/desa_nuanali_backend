import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Lembaga } from 'src/entities/lembaga.entity';
import { LembagaController } from './lembaga.controller';
import { LembagaService } from './lembaga.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lembaga]), AuthModule],
  controllers: [LembagaController],
  providers: [LembagaService]
})
export class LembagaModule {}