import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Lembaga {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column({ type: 'varchar', length: 255 })
    image: string;
  
    @Column({ type: 'varchar', length: 20 })
    contact: string;
}
