import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Video } from '../entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
    private readonly logger = new Logger(VideoService.name);

    constructor(
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createVideoDto: CreateVideoDto): Promise<Video> {
        let newVideo: Video;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newVideo = await transactionalEntityManager.save(
                this.videoRepository.create(createVideoDto),
            );
        });

        return newVideo!;
    }

    async findOne(id: string): Promise<Video | undefined> {
        return this.videoRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Video[]> {
        return this.videoRepository.find();
    }

    async remove(id: string): Promise<void> {
        const video = await this.videoRepository.findOne({ where: { id } });
        if (!video) {
            throw new NotFoundException(`Video with id ${id} not found`);
        }

        await this.videoRepository.delete(id);
    }
}
