import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Bagan } from 'src/entities/bagan.entity';
import { BaganController } from './bagan.controller';
import { BaganService } from './bagan.service';


@Module({
    imports: [TypeOrmModule.forFeature([Bagan]), AuthModule],
    controllers: [BaganController],
    providers: [BaganService]
})
export class BaganModule { }