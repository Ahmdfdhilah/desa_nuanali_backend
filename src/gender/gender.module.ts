import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Gender } from 'src/entities/gender.entity';
import { GenderController } from './gender.controller';
import { GenderService } from './gender.service';

@Module({
    imports: [TypeOrmModule.forFeature([Gender]), AuthModule],
    controllers: [GenderController],
    providers: [GenderService]
})
export class GenderModule { }