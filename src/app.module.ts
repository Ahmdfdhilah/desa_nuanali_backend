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
            synchronize: true
        }),
        UsersModule,
        AgendaModule,
        DanaDesaModule,
        BeritaModule,
        StrukturModule,
        WilayahModule,
        PembangunanModule,
        SeederModule,
        AuthModule,
    ],
    controllers: [],
})
export class AppModule {
    constructor(private readonly seederService: SeederService) { }

    async onModuleInit() {
        await this.seederService.seedAdminUser();
    }
}
