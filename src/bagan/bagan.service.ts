import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Bagan } from 'src/entities/bagan.entity';

@Injectable()
export class BaganService {
    constructor(
        @InjectRepository(Bagan)
        private readonly baganRepository: Repository<Bagan>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(BaganService.name);

    async create(img: string): Promise<Bagan> {
        // Check if there is already an entry in the table
        const existingBagan = await this.baganRepository.find();
        if (existingBagan.length > 0) {
            throw new ConflictException('Bagan entry already exists');
        }

        let newBagan: Bagan;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newBagan = await transactionalEntityManager.save(
                this.baganRepository.create({ img }),
            );
        });

        return newBagan!;
    }

    async find(): Promise<Bagan | undefined> {
        const bagans = await this.baganRepository.find();
        return bagans.length > 0 ? bagans[0] : undefined;
    }

    async remove(): Promise<void> {
        const bagans = await this.baganRepository.find();
        if (bagans.length === 0) {
            throw new NotFoundException('Bagan entry does not exist');
        }

        await this.baganRepository.delete(bagans[0].id);
    }
}
