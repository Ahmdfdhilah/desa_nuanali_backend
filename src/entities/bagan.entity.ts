import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bagan {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    img: string;
}
