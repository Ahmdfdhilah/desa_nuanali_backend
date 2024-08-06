import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Religion {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: ['Islam', 'Katolik', 'Budha', 'Hindu', 'Kristen'], unique: true, nullable: false })
    name: string;

    @Column({ type: "int", nullable: false })
    total: number;
}
