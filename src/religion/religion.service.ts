import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Religion } from '../entities/religion.entity';
import { CreateReligionDto } from './dto/create-religion.dto';
import { UpdateReligionDto } from './dto/update-religion.dto';

@Injectable()
export class ReligionService {
    private readonly logger = new Logger(ReligionService.name);

    constructor(
        @InjectRepository(Religion)
        private readonly religionRepository: Repository<Religion>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createReligionDto: CreateReligionDto): Promise<Religion> {
        let newReligion: Religion;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newReligion = await transactionalEntityManager.save(
                this.religionRepository.create(createReligionDto),
            );
        });
        return newReligion!;
    }

    async update(id: string, updateReligionDto: UpdateReligionDto): Promise<Religion> {
        let updatedReligion: Religion;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const religion = await transactionalEntityManager.findOne(Religion, { where: { id } });
            if (!religion) {
                throw new NotFoundException(`Religion with id ${id} not found`);
            }

            Object.assign(religion, updateReligionDto);
            updatedReligion = await transactionalEntityManager.save(religion);
        });

        return updatedReligion!;
    }

    async findOne(id: string): Promise<Religion | undefined> {
        return this.religionRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Religion[]> {
        return this.religionRepository.find();
    }

    async remove(id: string): Promise<void> {
        const religion = await this.religionRepository.findOne({ where: { id } });
        if (!religion) {
            throw new NotFoundException(`Religion with id ${id} not found`);
        }

        await this.religionRepository.delete(id);
    }
}