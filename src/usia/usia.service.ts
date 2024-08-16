import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Usia } from '../entities/usia.entity'; // Pastikan path-nya sesuai
import { CreateUsiaDto } from './dto/create-usia.dto'; // Pastikan path-nya sesuai
import { UpdateUsiaDto } from './dto/update-usia.dto'; // Pastikan path-nya sesuai

@Injectable()
export class UsiaService {
    private readonly logger = new Logger(UsiaService.name);

    constructor(
        @InjectRepository(Usia)
        private readonly usiaRepository: Repository<Usia>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createUsiaDto: CreateUsiaDto): Promise<Usia> {
        let newUsia: Usia;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newUsia = await transactionalEntityManager.save(
                this.usiaRepository.create(createUsiaDto),
            );
        });
        return newUsia!;
    }

    async update(id: string, updateUsiaDto: UpdateUsiaDto): Promise<Usia> {
        let updatedUsia: Usia;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const usia = await transactionalEntityManager.findOne(Usia, { where: { id } });
            if (!usia) {
                throw new NotFoundException(`Usia with id ${id} not found`);
            }

            Object.assign(usia, updateUsiaDto);
            updatedUsia = await transactionalEntityManager.save(usia);
        });

        return updatedUsia!;
    }

    async findOne(id: string): Promise<Usia | undefined> {
        return this.usiaRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Usia[]> {
        return this.usiaRepository.find();
    }

    async remove(id: string): Promise<void> {
        const usia = await this.usiaRepository.findOne({ where: { id } });
        if (!usia) {
            throw new NotFoundException(`Usia with id ${id} not found`);
        }

        await this.usiaRepository.delete(id);
    }
}
