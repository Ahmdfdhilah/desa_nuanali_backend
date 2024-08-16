import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Education } from 'src/entities/education.entity';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Education]), AuthModule],
    controllers: [EducationController],
    providers: [EducationService]
})
export class EducationModule { }