import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Wilayah } from 'src/entities/wilayah.entity';
import { CreateWilayahDto } from './dto/create-wilayah.dto';
import { UpdateWilayahDto } from './dto/update-wilayah.dto';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class WilayahService {
    constructor(
        @InjectRepository(Wilayah)
        private readonly wilayahRepository: Repository<Wilayah>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(WilayahService.name);

    async create(createWilayahDto: CreateWilayahDto): Promise<Wilayah> {
        let newWilayah: Wilayah;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newWilayah = await transactionalEntityManager.save(
                this.wilayahRepository.create(createWilayahDto),
            );
        });

        return newWilayah!;
    }

    async update(id: string, updateWilayahDto: UpdateWilayahDto): Promise<Wilayah> {
        let updatedWilayah: Wilayah;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const wilayah = await transactionalEntityManager.findOne(Wilayah, { where: { id } });
            if (!wilayah) {
                throw new NotFoundException(`Wilayah with id ${id} not found`);
            }

            Object.assign(wilayah, updateWilayahDto);
            updatedWilayah = await transactionalEntityManager.save(wilayah);
        });

        return updatedWilayah!;
    }

    async findOne(id: string): Promise<Wilayah | undefined> {
        return this.wilayahRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Wilayah[], total: number }> {
        const { limit, page, search, sort, order } = query;

        this.logger.log(`Fetching from DB`);

        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else if (order && !sort) {
            orderOption['id'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else {
            orderOption['id'] = 'DESC';
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

        let wilayahs: Wilayah[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.wilayahRepository.findAndCount(findOptions);
            wilayahs = result;
            total = count;
        } else {
            const result = await this.wilayahRepository.find(findOptions);
            wilayahs = result;
            total = result.length;
        }

        this.logger.log(`DB result - Wilayahs count: ${wilayahs.length}, Total count: ${total}`);

        const result = { data: wilayahs, total };
        return result;
    }

    async remove(id: string): Promise<void> {
        const wilayah = await this.wilayahRepository.findOne({ where: { id } });
        if (!wilayah) {
            throw new NotFoundException(`Wilayah with id ${id} not found`);
        }

        await this.wilayahRepository.delete(id);
    }
}