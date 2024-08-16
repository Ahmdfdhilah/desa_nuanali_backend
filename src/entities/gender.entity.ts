import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Gender {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "enum", enum: ["Laki-Laki", "Perempuan"], unique: true, nullable: false })
    name: string;

    @Column({ type: "int", nullable: false })
    total: number;
}
