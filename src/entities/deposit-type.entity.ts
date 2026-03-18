import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('deposit_type')
export class DepositType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}