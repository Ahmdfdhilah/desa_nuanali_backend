import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Pembangunan {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    judul: string;

    @Column({ type: 'simple-array',  nullable: false })
    foto: string[];

    @Column({ type: 'text', nullable: true })
    deskripsi: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    lokasi: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
    anggaran: number;

    @Column({ type: 'int', nullable: false })
    tahun: number;

    @Column({ type: 'int', nullable: false })
    progres: number;

    @CreateDateColumn()
    createdAt: Date; 

    @UpdateDateColumn()
    updatedAt: Date;
}
