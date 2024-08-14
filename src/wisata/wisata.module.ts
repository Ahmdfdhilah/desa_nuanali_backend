import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Wisata } from 'src/entities/wisata.entity';
import { WisataController } from './wisata.controller';
import { WisataService } from './wisata.service';

@Module({
    imports: [TypeOrmModule.forFeature([Wisata]), AuthModule],
    controllers: [WisataController],
    providers: [WisataService]
})
export class WisatanModule { }