import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { DanaDesa } from 'src/entities/dana-desa.entity';
import { CreateDanaDesaDto } from './dto/create-dana-desa.dto';
import { UpdateDanaDesaDto } from './dto/update-dana-desa.dto';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class DanaDesaService {
    constructor(
        @InjectRepository(DanaDesa)
        private readonly danaDesaRepository: Repository<DanaDesa>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(DanaDesaService.name);

    async create(createDanaDesaDto: CreateDanaDesaDto): Promise<DanaDesa> {
        let newDanaDesa: DanaDesa;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newDanaDesa = await transactionalEntityManager.save(
                this.danaDesaRepository.create(createDanaDesaDto),
            );
        });

        return newDanaDesa!;
    }

    async update(id: string, updateDanaDesaDto: UpdateDanaDesaDto): Promise<DanaDesa> {
        let updatedDanaDesa: DanaDesa;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const danaDesa = await transactionalEntityManager.findOne(DanaDesa, { where: { id } });
            if (!danaDesa) {
                throw new NotFoundException(`DanaDesa with id ${id} not found`);
            }

            Object.assign(danaDesa, updateDanaDesaDto);
            updatedDanaDesa = await transactionalEntityManager.save(danaDesa);
        });

        return updatedDanaDesa!;
    }

    async findOne(id: string): Promise<DanaDesa | undefined> {
        return this.danaDesaRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: DanaDesa[], total: number }> {
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
            findOptions.where = { nama: Like(`%${search}%`) };
        }

        let danaDesas: DanaDesa[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.danaDesaRepository.findAndCount(findOptions);
            danaDesas = result;
            total = count;
        } else {
            const result = await this.danaDesaRepository.find(findOptions);
            danaDesas = result;
            total = result.length;
        }

        this.logger.log(`DB result - DanaDesas count: ${danaDesas.length}, Total count: ${total}`);

        const result = { data: danaDesas, total };
        return result;
    }

    async remove(id: string): Promise<void> {
        const danaDesa = await this.danaDesaRepository.findOne({ where: { id } });
        if (!danaDesa) {
            throw new NotFoundException(`DanaDesa with id ${id} not found`);
        }

        await this.danaDesaRepository.delete(id);
    }
}