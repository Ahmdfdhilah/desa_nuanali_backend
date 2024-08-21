import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { AuthModule } from 'src/auth/auth.module';
import { Banner } from 'src/entities/banners.entity';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';


@Module({
    imports: [TypeOrmModule.forFeature([Banner]), AuthModule],
    controllers: [BannerController],
    providers: [BannerService]
})
export class BannerModule { }