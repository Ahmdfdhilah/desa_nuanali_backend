import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Wisata } from '../entities/wisata.entity';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class WisataService {
    private readonly logger = new Logger(WisataService.name);

    constructor(
        @InjectRepository(Wisata)
        private readonly wisataRepository: Repository<Wisata>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createWisataDto: CreateWisataDto, fotoFiles?: string[]): Promise<Wisata> {
        let newWisata: Wisata;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataWisata = {
                ...createWisataDto,
                foto: fotoFiles || [],
            };

            newWisata = await transactionalEntityManager.save(
                this.wisataRepository.create(dataWisata),
            );
        });

        return newWisata!;
    }

    async update(id: string, updateWisataDto: UpdateWisataDto, fotoFiles?: string[]): Promise<Wisata> {
        let updatedWisata: Wisata;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const wisata = await transactionalEntityManager.findOne(Wisata, { where: { id } });
            if (!wisata) {
                throw new NotFoundException(`Wisata with id ${id} not found`);
            }

            const existingFoto = wisata.foto || [];
            const newFoto = fotoFiles ? [...existingFoto, ...fotoFiles] : existingFoto;

            const dataWisata = { ...updateWisataDto, foto: newFoto };

            Object.assign(wisata, dataWisata);
            updatedWisata = await transactionalEntityManager.save(wisata);
        });

        return updatedWisata!;
    }

    async deleteFoto(wisataId: string, fotoUrl: string): Promise<void> {
        const wisata = await this.wisataRepository.findOne({ where: { id: wisataId } });
        if (!wisata) {
            throw new NotFoundException(`Wisata with id ${wisataId} not found`);
        }

        wisata.foto = wisata.foto.filter(foto => foto !== fotoUrl);

        const filePath = path.join(__dirname, '../../public/upload/wisata', path.basename(fotoUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.wisataRepository.save(wisata);
    }

    async findOne(id: string): Promise<Wisata | undefined> {
        return this.wisataRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Wisata[], total: number }> {
        let { limit, page, search, sort, order } = query;
    
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

        let wisata: Wisata[];
        let total: number;
        if (limit && page) {
            const [result, count] = await this.wisataRepository.findAndCount({
                take: limit,
                skip: skip,
                where: search ? { title: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            wisata = result;
            total = count;
        } else {
            const result = await this.wisataRepository.find({
                where: search ? { title: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            wisata = result;
            total = result.length;
        }

        this.logger.log(`DB result - Wisata count: ${wisata.length}, Total count: ${total}`);

        return { data: wisata, total };
    }

    async remove(id: string): Promise<void> {
        const wisata = await this.wisataRepository.findOne({ where: { id } });
        if (!wisata) {
            throw new NotFoundException(`Wisata with id ${id} not found`);
        }

        if (wisata.foto && wisata.foto.length > 0) {
            for (const file of wisata.foto) {
                const filePath = path.join(__dirname, '../../public/upload/wisata', path.basename(file));
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
        }

        await this.wisataRepository.delete(id);
    }
}
