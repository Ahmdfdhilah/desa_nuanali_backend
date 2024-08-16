import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Status } from '../entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
    private readonly logger = new Logger(StatusService.name);

    constructor(
        @InjectRepository(Status)
        private readonly statusRepository: Repository<Status>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createStatusDto: CreateStatusDto): Promise<Status> {
        let newStatus: Status;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newStatus = await transactionalEntityManager.save(
                this.statusRepository.create(createStatusDto),
            );
        });
        return newStatus!;
    }

    async update(id: string, updateStatusDto: UpdateStatusDto): Promise<Status> {
        let updatedStatus: Status;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const status = await transactionalEntityManager.findOne(Status, { where: { id } });
            if (!status) {
                throw new NotFoundException(`Status with id ${id} not found`);
            }

            Object.assign(status, updateStatusDto);
            updatedStatus = await transactionalEntityManager.save(status);
        });

        return updatedStatus!;
    }

    async findOne(id: string): Promise<Status | undefined> {
        return this.statusRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Status[]> {
        return this.statusRepository.find();
    }

    async remove(id: string): Promise<void> {
        const status = await this.statusRepository.findOne({ where: { id } });
        if (!status) {
            throw new NotFoundException(`Status with id ${id} not found`);
        }

        await this.statusRepository.delete(id);
    }
}
