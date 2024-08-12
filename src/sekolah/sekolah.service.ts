import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Sekolah } from '../entities/sekolah.entity';
import { CreateSekolahDto } from './dto/create-sekolah.dto';
import { UpdateSekolahDto } from './dto/update-sekolah.dto';

@Injectable()
export class SekolahService {
    private readonly logger = new Logger(SekolahService.name);

    constructor(
        @InjectRepository(Sekolah)
        private readonly sekolahRepository: Repository<Sekolah>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createSekolahDto: CreateSekolahDto): Promise<Sekolah> {
        let newSekolah: Sekolah;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newSekolah = await transactionalEntityManager.save(
                this.sekolahRepository.create(createSekolahDto),
            );
        });
        return newSekolah!;
    }

    async update(id: string, updateSekolahDto: UpdateSekolahDto): Promise<Sekolah> {
        let updatedSekolah: Sekolah;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const sekolah = await transactionalEntityManager.findOne(Sekolah, { where: { id } });
            if (!sekolah) {
                throw new NotFoundException(`Sekolah with id ${id} not found`);
            }

            Object.assign(sekolah, updateSekolahDto);
            updatedSekolah = await transactionalEntityManager.save(sekolah);
        });

        return updatedSekolah!;
    }

    async findOne(id: string): Promise<Sekolah | undefined> {
        return this.sekolahRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Sekolah[]> {
        return this.sekolahRepository.find();
    }

    async remove(id: string): Promise<void> {
        const sekolah = await this.sekolahRepository.findOne({ where: { id } });
        if (!sekolah) {
            throw new NotFoundException(`Sekolah with id ${id} not found`);
        }

        await this.sekolahRepository.delete(id);
    }
}
