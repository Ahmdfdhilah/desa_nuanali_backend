import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Pembangunan } from '../entities/pembangunan.entity';
import { QueryDto } from 'src/lib/query.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CreatePembangunanDto } from './dto/create-pembangunan.dto';
import { UpdatePembangunanDto } from './dto/update-pembangunan.dto';

@Injectable()
export class PembangunanService {
    private readonly logger = new Logger(PembangunanService.name);

    constructor(
        @InjectRepository(Pembangunan)
        private readonly pembangunanRepository: Repository<Pembangunan>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createPembangunanDto: CreatePembangunanDto, fotoFiles?: string[]): Promise<Pembangunan> {
        let newPembangunan: Pembangunan;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataPembangunan = {
                ...createPembangunanDto,
                foto: fotoFiles || [],
            };

            newPembangunan = await transactionalEntityManager.save(
                this.pembangunanRepository.create(dataPembangunan),
            );
        });
        return newPembangunan!;
    }

    async update(id: string, updatePembangunanDto: UpdatePembangunanDto, fotoFiles?: string[]): Promise<Pembangunan> {
        let updatedPembangunan: Pembangunan;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const pembangunan = await transactionalEntityManager.findOne(Pembangunan, { where: { id } });
            if (!pembangunan) {
                throw new NotFoundException(`Pembangunan with id ${id} not found`);
            }

            const existingFoto = pembangunan.foto || [];
            const newFoto = fotoFiles ? [...existingFoto, ...fotoFiles] : existingFoto;

            const dataPembangunan = { ...updatePembangunanDto, foto: newFoto };

            Object.assign(pembangunan, dataPembangunan);
            updatedPembangunan = await transactionalEntityManager.save(pembangunan);
        });

        return updatedPembangunan!;
    }

    async deleteFoto(pembangunanId: string, fotoUrl: string): Promise<void> {
        const pembangunan = await this.pembangunanRepository.findOne({ where: { id: pembangunanId } });
        if (!pembangunan) {
            throw new NotFoundException(`Pembangunan with id ${pembangunanId} not found`);
        }

        pembangunan.foto = pembangunan.foto.filter(foto => foto !== fotoUrl);

        const filePath = path.join(__dirname, '../../public/upload/pembangunan', path.basename(fotoUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.pembangunanRepository.save(pembangunan);
    }

    async findOne(id: string): Promise<Pembangunan | undefined> {
        return this.pembangunanRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Pembangunan[], total: number }> {
        let { limit, page, search, sort, order } = query;

        this.logger.log(`Fetching from DB with limit: ${limit}, page: ${page}`);

        if (limit) {
            limit = parseInt(limit as any, 10);
        }
        if (page) {
            page = parseInt(page as any, 10);
        }

        let skip = 0;
        if (limit && page) {
            skip = (page - 1) * limit;
        }

        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else if (order && !sort) {
            orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else {
            orderOption['createdAt'] = 'DESC';
        }

        let pembangunanList: Pembangunan[];
        let total: number;
        if (limit && page) {
            const [result, count] = await this.pembangunanRepository.findAndCount({
                take: limit,
                skip: skip,
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            pembangunanList = result;
            total = count;
        } else {
            const result = await this.pembangunanRepository.find({
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            pembangunanList = result;
            total = result.length;
        }

        this.logger.log(`DB result - Pembangunan count: ${pembangunanList.length}, Total count: ${total}`);

        const result = { data: pembangunanList, total };

        return result;
    }

    async remove(id: string): Promise<void> {
        const pembangunan = await this.pembangunanRepository.findOne({ where: { id } });
        if (!pembangunan) {
            throw new NotFoundException(`Pembangunan with id ${id} not found`);
        }
        if (pembangunan.foto && pembangunan.foto.length > 0) {
            for (const file of pembangunan.foto) {
                const filePath = path.join(__dirname, '../../public/upload/pembangunan', path.basename(file));
                if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
            }
        }

        await this.pembangunanRepository.delete(id);
    }

}
