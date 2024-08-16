import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Usia } from 'src/entities/usia.entity';
import { UsiaService } from './usia.service';
import { UsiaController } from './usia.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Usia]), AuthModule],
    controllers: [UsiaController],
    providers: [UsiaService],
})
export class UsiaModule {}