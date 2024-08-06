import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Religion } from 'src/entities/religion.entity';
import { ReligionController } from './religion.controller';
import { ReligionService } from './religion.service';

@Module({
    imports: [TypeOrmModule.forFeature([Religion]), AuthModule],
    controllers: [ReligionController],
    providers: [ReligionService]
})
export class ReligionModule { }