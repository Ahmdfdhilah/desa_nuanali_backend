import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Status } from 'src/entities/status.entity';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Status]), AuthModule],
    controllers: [StatusController],
    providers: [StatusService]
})
export class StatusModule { }