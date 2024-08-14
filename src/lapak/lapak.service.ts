import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, Like } from 'typeorm';
import { Lapak } from 'src/entities/lapak.entity';
import { CreateLapakDto } from './dto/create-lapak.dto';
import { UpdateLapakDto } from './dto/update-lapak.dto';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class LapakService {
    constructor(
        @InjectRepository(Lapak)
        private readonly lapakRepository: Repository<Lapak>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(LapakService.name);

    async create(createLapakDto: CreateLapakDto, imageSrc?: string): Promise<Lapak> {
        const newLapak = this.lapakRepository.create({
            ...createLapakDto,
            image: imageSrc,
        });

        return this.lapakRepository.save(newLapak);
    }

    async update(id: string, updateLapakDto: UpdateLapakDto, imageSrc?: string): Promise<Lapak> {
        const lapak = await this.lapakRepository.findOne({ where: { id } });
        if (!lapak) {
            throw new NotFoundException(`Lapak with id ${id} not found`);
        }

        if (imageSrc && lapak.image) {
            const oldImagePath = path.join(__dirname, '../../public/upload/lapak', path.basename(lapak.image));
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        Object.assign(lapak, updateLapakDto, { image: imageSrc || lapak.image });

        return this.lapakRepository.save(lapak);
    }

    async findOne(id: string): Promise<Lapak | undefined> {
        return this.lapakRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Lapak[], total: number }> {
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
            findOptions.where = { name: Like(`%${search}%`) };
        }

        let lapak: Lapak[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.lapakRepository.findAndCount(findOptions);
            lapak = result;
            total = count;
        } else {
            const result = await this.lapakRepository.find(findOptions);
            lapak = result;
            total = result.length;
        }

        this.logger.log(`DB result - Lapak count: ${lapak.length}, Total count: ${total}`);

        return { data: lapak, total };
    }

    async remove(id: string): Promise<void> {
        const lapak = await this.lapakRepository.findOne({ where: { id } });
        if (!lapak) {
            throw new NotFoundException(`Lapak with id ${id} not found`);
        }

        if (lapak.image) {
            const imagePath = path.join(__dirname, '../../public/upload/lapak', path.basename(lapak.image));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await this.lapakRepository.delete(id);
    }
}
