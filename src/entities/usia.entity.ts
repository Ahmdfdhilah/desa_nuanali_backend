import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usia {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: ['< 10 Tahun', '11 - 20 Tahun', '21 - 30 Tahun', '31 - 40 Tahun', '41 - 50 Tahun', '> 50 Tahun'], unique: true, nullable: false })
    name: string;

    @Column({ type: "int", nullable: false })
    total: number;
}
