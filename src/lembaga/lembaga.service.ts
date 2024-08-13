import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Lembaga } from 'src/entities/lembaga.entity';
import { CreateLembagaDto } from './dto/create-lembaga.dto';
import { UpdateLembagaDto } from './dto/update-lembaga.dto';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class LembagaService {
    constructor(
        @InjectRepository(Lembaga)
        private readonly lembagaRepository: Repository<Lembaga>,
        private readonly entityManager: EntityManager,
    ) {}

    private readonly logger = new Logger(LembagaService.name);

    async create(createLembagaDto: CreateLembagaDto, imgSrc: string): Promise<Lembaga> {
        let newLembaga: Lembaga;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataLembaga = { ...createLembagaDto, image: imgSrc };
            newLembaga = await transactionalEntityManager.save(
                this.lembagaRepository.create(dataLembaga),
            );
        });

        return newLembaga!;
    }

    async update(
        id: string,
        updateLembagaDto: UpdateLembagaDto,
        imgSrc?: string,
    ): Promise<Lembaga> {
        let updatedLembaga: Lembaga;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const lembaga = await transactionalEntityManager.findOne(Lembaga, { where: { id } });
            if (!lembaga) {
                throw new NotFoundException(`Lembaga with id ${id} not found`);
            }
            if (imgSrc) {
                const oldImagePath = path.join(__dirname, '../../public/upload/lembaga', path.basename(lembaga.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedData = {
                ...updateLembagaDto,
                image: imgSrc || lembaga.image,
            };

            Object.assign(lembaga, updatedData);
            updatedLembaga = await transactionalEntityManager.save(lembaga);
        });

        return updatedLembaga!;
    }

    async findOne(id: string): Promise<Lembaga | undefined> {
        return this.lembagaRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Lembaga[], total: number }> {
        const { limit, page, search, sort, order } = query;

        this.logger.log(`Fetching from DB`);

        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else if (order && !sort) {
            orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
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

        let lembagas: Lembaga[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.lembagaRepository.findAndCount(findOptions);
            lembagas = result;
            total = count;
        } else {
            const result = await this.lembagaRepository.find(findOptions);
            lembagas = result;
            total = result.length;
        }

        this.logger.log(`DB result - Lembagas count: ${lembagas.length}, Total count: ${total}`);

        const result = { data: lembagas, total };
        return result;
    }

    async remove(id: string): Promise<void> {
        const lembaga = await this.lembagaRepository.findOne({ where: { id } });
        if (!lembaga) {
            throw new NotFoundException(`Lembaga with id ${id} not found`);
        }

        const imagePath = path.join(__dirname, '../../public/upload/lembaga', path.basename(lembaga.image));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await this.lembagaRepository.delete(id);
    }
}
