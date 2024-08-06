import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Struktur } from 'src/entities/struktur.entity';
import { CreateStrukturDto } from './dto/create-struktur.dto';
import { UpdateStrukturDto } from './dto/update-struktur.dto';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class StrukturService {
    constructor(
        @InjectRepository(Struktur)
        private readonly strukturRepository: Repository<Struktur>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(StrukturService.name);

    async create(createStrukturDto: CreateStrukturDto, fotoSrc?: string): Promise<Struktur> {
        let newStruktur: Struktur;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataStruktur = { ...createStrukturDto, foto: fotoSrc };
            newStruktur = await transactionalEntityManager.save(
                this.strukturRepository.create(dataStruktur),
            );
        });

        return newStruktur!;
    }

    async update(
        id: string,
        updateStrukturDto: UpdateStrukturDto,
        fotoSrc?: string,
    ): Promise<Struktur> {
        let updatedStruktur: Struktur;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const struktur = await transactionalEntityManager.findOne(Struktur, { where: { id } });
            if (!struktur) {
                throw new NotFoundException(`Struktur with id ${id} not found`);
            }
            if (fotoSrc) {
                const oldFotoPath = path.join(__dirname, '../../public/upload/struktur', path.basename(struktur.foto));
                if (fs.existsSync(oldFotoPath)) {
                    fs.unlinkSync(oldFotoPath);
                }
            }

            const updatedData = {
                ...updateStrukturDto,
                foto: fotoSrc || struktur.foto,
            };

            Object.assign(struktur, updatedData);
            updatedStruktur = await transactionalEntityManager.save(struktur);
        });

        return updatedStruktur!;
    }

    async findOne(id: string): Promise<Struktur | undefined> {
        return this.strukturRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Struktur[], total: number }> {
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

        let struktur: Struktur[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.strukturRepository.findAndCount(findOptions);
            struktur = result;
            total = count;
        } else {
            const result = await this.strukturRepository.find(findOptions);
            struktur = result;
            total = result.length;
        }

        this.logger.log(`DB result - Struktur count: ${struktur.length}, Total count: ${total}`);

        const result = { data: struktur, total };
        return result;
    }

    async remove(id: string): Promise<void> {
        const struktur = await this.strukturRepository.findOne({ where: { id } });
        if (!struktur) {
            throw new NotFoundException(`Struktur with id ${id} not found`);
        }

        const fotoPath = path.join(__dirname, '../../public/upload/struktur', path.basename(struktur.foto));
        if (fs.existsSync(fotoPath)) {
            fs.unlinkSync(fotoPath);
        }

        await this.strukturRepository.delete(id);
    }
}
