import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class Banner {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', nullable: true })
    img: string;

    @Column({ type: 'varchar', nullable: true })
    text: string;

    @Column({ type: 'int', nullable: true, default: 0 })
    order: number; 

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
