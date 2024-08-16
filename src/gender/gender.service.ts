import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Gender } from '../entities/gender.entity';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';

@Injectable()
export class GenderService {
    private readonly logger = new Logger(GenderService.name);

    constructor(
        @InjectRepository(Gender)
        private readonly genderRepository: Repository<Gender>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createGenderDto: CreateGenderDto): Promise<Gender> {
        let newGender: Gender;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newGender = await transactionalEntityManager.save(
                this.genderRepository.create(createGenderDto),
            );
        });
        return newGender!;
    }

    async update(id: string, updateGenderDto: UpdateGenderDto): Promise<Gender> {
        let updatedGender: Gender;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const gender = await transactionalEntityManager.findOne(Gender, { where: { id } });
            if (!gender) {
                throw new NotFoundException(`Gender with id ${id} not found`);
            }

            Object.assign(gender, updateGenderDto);
            updatedGender = await transactionalEntityManager.save(gender);
        });

        return updatedGender!;
    }

    async findOne(id: string): Promise<Gender | undefined> {
        return this.genderRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Gender[]> {
        return this.genderRepository.find();
    }

    async remove(id: string): Promise<void> {
        const gender = await this.genderRepository.findOne({ where: { id } });
        if (!gender) {
            throw new NotFoundException(`Gender with id ${id} not found`);
        }

        await this.genderRepository.delete(id);
    }
}
