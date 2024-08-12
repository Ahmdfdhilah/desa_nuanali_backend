import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sekolah {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: ['Paud', 'TK', 'SD', 'SMP', 'SMA'], unique: true, nullable: false })
    name: string;

    @Column({ type: "int", nullable: false })
    total: number;
}
