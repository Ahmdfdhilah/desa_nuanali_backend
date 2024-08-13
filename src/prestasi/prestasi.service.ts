import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Like } from 'typeorm';
import { Prestasi } from 'src/entities/prestasi.entity';
import { CreatePrestasiDto } from './dto/create-prestasi.dto';
import { UpdatePrestasiDto } from './dto/update-prestasi.dto';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class PrestasiService {
    constructor(
        @InjectRepository(Prestasi)
        private readonly prestasiRepository: Repository<Prestasi>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(PrestasiService.name);

    async create(createPrestasiDto: CreatePrestasiDto, fotoSrc?: string): Promise<Prestasi> {
        const newPrestasi = this.prestasiRepository.create({
            ...createPrestasiDto,
            foto: fotoSrc,
        });

        return this.prestasiRepository.save(newPrestasi);
    }

    async update(id: string, updatePrestasiDto: UpdatePrestasiDto, fotoSrc?: string): Promise<Prestasi> {
        const prestasi = await this.prestasiRepository.findOne({ where: { id } });
        if (!prestasi) {
            throw new NotFoundException(`Prestasi with id ${id} not found`);
        }

        if (fotoSrc && prestasi.foto) {
            const oldImagePath = path.join(__dirname, '../../public/upload/prestasi', path.basename(prestasi.foto));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        Object.assign(prestasi, updatePrestasiDto, { foto: fotoSrc || prestasi.foto });

        return this.prestasiRepository.save(prestasi);
    }

    async findOne(id: string): Promise<Prestasi | undefined> {
        return this.prestasiRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Prestasi[], total: number }> {
        const { limit, page, search, sort, order } = query;

        this.logger.log(`Fetching from DB`);

        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else {
            orderOption['createdAt'] = 'DESC';
        }

        const findOptions: any = {
            order: orderOption,
        };

        if (limit && page) {
            findOptions.take = parseInt(limit as any, 10);
            findOptions.skip = (parseInt(page as any, 10) - 1) * findOptions.take;
        }

        if (search) {
            findOptions.where = { title: Like(`%${search}%`) };
        }

        let prestasi: Prestasi[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.prestasiRepository.findAndCount(findOptions);
            prestasi = result;
            total = count;
        } else {
            const result = await this.prestasiRepository.find(findOptions);
            prestasi = result;
            total = result.length;
        }

        this.logger.log(`DB result - Prestasi count: ${prestasi.length}, Total count: ${total}`);

        return { data: prestasi, total };
    }

    async remove(id: string): Promise<void> {
        const prestasi = await this.prestasiRepository.findOne({ where: { id } });
        if (!prestasi) {
            throw new NotFoundException(`Prestasi with id ${id} not found`);
        }

        if (prestasi.foto) {
            const imagePath = path.join(__dirname, '../../public/upload/prestasi', path.basename(prestasi.foto));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await this.prestasiRepository.delete(id);
    }
}
