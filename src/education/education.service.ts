import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Education } from '../entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
    private readonly logger = new Logger(EducationService.name);

    constructor(
        @InjectRepository(Education)
        private readonly educationRepository: Repository<Education>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createEducationDto: CreateEducationDto): Promise<Education> {
        let newEducation: Education;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newEducation = await transactionalEntityManager.save(
                this.educationRepository.create(createEducationDto),
            );
        });
        return newEducation!;
    }

    async update(id: string, updateEducationDto: UpdateEducationDto): Promise<Education> {
        let updatedEducation: Education;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const education = await transactionalEntityManager.findOne(Education, { where: { id } });
            if (!education) {
                throw new NotFoundException(`Education with id ${id} not found`);
            }

            Object.assign(education, updateEducationDto);
            updatedEducation = await transactionalEntityManager.save(education);
        });

        return updatedEducation!;
    }

    async findOne(id: string): Promise<Education | undefined> {
        return this.educationRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Education[]> {
        return this.educationRepository.find();
    }

    async remove(id: string): Promise<void> {
        const education = await this.educationRepository.findOne({ where: { id } });
        if (!education) {
            throw new NotFoundException(`Education with id ${id} not found`);
        }

        await this.educationRepository.delete(id);
    }
}
