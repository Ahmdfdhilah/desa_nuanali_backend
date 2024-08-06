import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Pekerjaan } from 'src/entities/pekerjaan.entity';
import { CreatePekerjaanDto } from './dto/create-pekerjaan.dto';
import { UpdatePekerjaanDto } from './dto/update-pekerjaan.dto';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class PekerjaanService {
    constructor(
        @InjectRepository(Pekerjaan)
        private readonly pekerjaanRepository: Repository<Pekerjaan>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(PekerjaanService.name);

    async create(createPekerjaanDto: CreatePekerjaanDto): Promise<Pekerjaan> {
        let newPekerjaan: Pekerjaan;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newPekerjaan = await transactionalEntityManager.save(
                this.pekerjaanRepository.create(createPekerjaanDto),
            );
        });

        return newPekerjaan!;
    }

    async update(id: string, updatePekerjaanDto: UpdatePekerjaanDto): Promise<Pekerjaan> {
        let updatedPekerjaan: Pekerjaan;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const pekerjaan = await transactionalEntityManager.findOne(Pekerjaan, { where: { id } });
            if (!pekerjaan) {
                throw new NotFoundException(`Pekerjaan with id ${id} not found`);
            }

            Object.assign(pekerjaan, updatePekerjaanDto);
            updatedPekerjaan = await transactionalEntityManager.save(pekerjaan);
        });

        return updatedPekerjaan!;
    }

    async findOne(id: string): Promise<Pekerjaan | undefined> {
        return this.pekerjaanRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Pekerjaan[], total: number }> {
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

        let pekerjaan: Pekerjaan[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.pekerjaanRepository.findAndCount(findOptions);
            pekerjaan = result;
            total = count;
        } else {
            const result = await this.pekerjaanRepository.find(findOptions);
            pekerjaan = result;
            total = result.length;
        }

        this.logger.log(`DB result - Pekerjaan count: ${pekerjaan.length}, Total count: ${total}`);

        const result = { data: pekerjaan, total };
        return result;
    }

    async remove(id: string): Promise<void> {
        const pekerjaan = await this.pekerjaanRepository.findOne({ where: { id } });
        if (!pekerjaan) {
            throw new NotFoundException(`Pekerjaan with id ${id} not found`);
        }

        await this.pekerjaanRepository.delete(id);
    }
}