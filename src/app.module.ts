import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { AuthModule } from './auth/auth.module';
import { AgendaModule } from './agenda/agenda.module';
import { BeritaModule } from './berita/berita.module';
import { StrukturModule } from './struktur/struktur.module';
import { DanaDesaModule } from './dana-desa/dana-desa.module';
import { PembangunanModule } from './pembangunan/pembangunan.module';
import { WilayahModule } from './wilayah/wilayah.module';
import { PekerjaanModule } from './pekerjaan/pekerjaan.module';
import { ReligionModule } from './religion/religion.module';
import { SekolahModule } from './sekolah/sekolah.module';
import { LembagaModule } from './lembaga/lembaga.module';
import { WisatanModule } from './wisata/wisata.module';
import { PrestasiModule } from './prestasi/prestasi.module';
import { LapakModule } from './lapak/lapak.module';
import { PhotoModule } from './photo/photo.module';
import { VideoModule } from './video/video.module';
import { EducationModule } from './education/education.module';
import { GenderModule } from './gender/gender.module';
import { StatusModule } from './status/status.module';
import { UsiaModule } from './usia/usia.module';
import { BaganModule } from './bagan/bagan.module';
import { BannerModule } from './banners/banner.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false
        }),
        AgendaModule,
        AuthModule,
        BeritaModule,
        BaganModule,
        DanaDesaModule,
        EducationModule,
        GenderModule,
        BannerModule,
        LapakModule,
        LembagaModule,
        PembangunanModule,
        PekerjaanModule,
        PhotoModule,
        PrestasiModule,
        ReligionModule,
        SeederModule,
        SekolahModule,
        StatusModule,
        StrukturModule,
        UsiaModule,
        UsersModule,
        VideoModule,
        WilayahModule,
        WisatanModule,
    ],
    controllers: [],
})
export class AppModule {
    constructor(private readonly seederService: SeederService) { }

    async onModuleInit() {
        await this.seederService.seedAdminUser();
    }
}
