import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Video } from '../entities/video.entity'; // Update this import as needed
import { QueryDto } from 'src/lib/query.dto'; // Update this import as needed
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
    private readonly logger = new Logger(VideoService.name);

    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
        private readonly entityManager: EntityManager,
    ) {}

    async create(createVideoDto: CreateVideoDto): Promise<Video> {
        const newVideo = this.videoRepository.create(createVideoDto);
        return this.videoRepository.save(newVideo);
    }

    async findOne(id: string): Promise<Video | undefined> {
        return this.videoRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Video[], total: number }> {
        const { limit, page, sort, order } = query;

        this.logger.log(`Fetching videos from DB`);

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

        const [videos, total] = await this.videoRepository.findAndCount(findOptions);

        this.logger.log(`DB result - Video count: ${videos.length}, Total count: ${total}`);

        return { data: videos, total };
    }

    async remove(id: string): Promise<void> {
        const video = await this.videoRepository.findOne({ where: { id } });
        if (!video) {
            throw new NotFoundException(`Video with id ${id} not found`);
        }
        await this.videoRepository.delete(id);
    }
}
