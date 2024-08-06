import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Berita } from 'src/entities/berita.entity';
import { CreateBeritaDto } from './dto/create-berita.dto';
import { UpdateBeritaDto } from './dto/update-berita.dto';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class BeritaService {
    constructor(
        @InjectRepository(Berita)
        private readonly beritaRepository: Repository<Berita>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(BeritaService.name);

    async create(createBeritaDto: CreateBeritaDto, imgSrc: string): Promise<Berita> {
        let newBerita: Berita;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataBerita = { ...createBeritaDto, image: imgSrc };
            newBerita = await transactionalEntityManager.save(
                this.beritaRepository.create(dataBerita),
            );
        });

        return newBerita!;
    }

    async update(
        id: string,
        updateBeritaDto: UpdateBeritaDto,
        imgSrc?: string,
    ): Promise<Berita> {
        let updatedBerita: Berita;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const berita = await transactionalEntityManager.findOne(Berita, { where: { id } });
            if (!berita) {
                throw new NotFoundException(`Berita with id ${id} not found`);
            }
            if (imgSrc) {
                const oldImagePath = path.join(__dirname, '../../public/upload/beritas', path.basename(berita.image));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedData = {
                ...updateBeritaDto,
                image: imgSrc || berita.image,
            };

            Object.assign(berita, updatedData);
            updatedBerita = await transactionalEntityManager.save(berita);
        });

        return updatedBerita!;
    }

    async findOne(id: string): Promise<Berita | undefined> {
        return this.beritaRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Berita[], total: number }> {
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
            findOptions.where = { title: Like(`%${search}%`) };
        }

        let beritas: Berita[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.beritaRepository.findAndCount(findOptions);
            beritas = result;
            total = count;
        } else {
            const result = await this.beritaRepository.find(findOptions);
            beritas = result;
            total = result.length;
        }

        this.logger.log(`DB result - Beritas count: ${beritas.length}, Total count: ${total}`);

        const result = { data: beritas, total };
        return result;
    }

    async remove(id: string): Promise<void> {
        const berita = await this.beritaRepository.findOne({ where: { id } });
        if (!berita) {
            throw new NotFoundException(`Berita with id ${id} not found`);
        }

        const imagePath = path.join(__dirname, '../../public/upload/beritas', path.basename(berita.image));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await this.beritaRepository.delete(id);
    }
}
