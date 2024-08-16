import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Photo } from 'src/entities/photo.entity';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class PhotoService {
    private readonly logger = new Logger(PhotoService.name);

    constructor(
        @InjectRepository(Photo)
        private readonly photoRepository: Repository<Photo>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(photoSrcs: string[]): Promise<Photo[]> {
        const newPhotos = photoSrcs.map(src => this.photoRepository.create({ src }));
        return this.photoRepository.save(newPhotos);
    }

    async findOne(id: string): Promise<Photo | undefined> {
        return this.photoRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Photo[], total: number }> {
        const { limit, page, sort, order } = query;

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

        const [photos, total] = await this.photoRepository.findAndCount(findOptions);

        this.logger.log(`DB result - Photo count: ${photos.length}, Total count: ${total}`);

        return { data: photos, total };
    }

    async remove(id: string): Promise<void> {
        const photo = await this.photoRepository.findOne({ where: { id } });
        if (!photo) {
            throw new NotFoundException(`Photo with id ${id} not found`);
        }

        if (photo.src) {
            const imagePath = path.join(__dirname, '../../public/upload/photo', path.basename(photo.src));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await this.photoRepository.delete(id);
    }
}
