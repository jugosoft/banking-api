import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { DepositEntity } from './deposit.entity';

@Entity('deposit_type')
export class DepositTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => DepositEntity, deposit => deposit.depositType)
    deposits: DepositEntity[];
}