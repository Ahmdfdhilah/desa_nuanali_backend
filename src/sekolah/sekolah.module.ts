import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Sekolah } from 'src/entities/sekolah.entity';
import { SekolahController } from './sekolah.controller';
import { SekolahService } from './sekolah.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Sekolah]), 
        AuthModule,
    ],
    controllers: [SekolahController], 
    providers: [SekolahService], 
})
export class SekolahModule {}
