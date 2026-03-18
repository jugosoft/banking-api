import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bank')
export class Bank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    shortName: string;
}