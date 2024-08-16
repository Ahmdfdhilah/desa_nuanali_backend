import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Status {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: ['Menikah', 'Bercerai', 'Belum Menikah'], unique: true, nullable: false })
    name: string;

    @Column({ type: "int", nullable: false })
    total: number;
}
