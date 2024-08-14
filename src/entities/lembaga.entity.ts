import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
      
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
