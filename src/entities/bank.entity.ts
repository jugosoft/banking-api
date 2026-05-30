import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DepositEntity } from './deposit.entity';

@Entity('bank')
export class BankEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    shortName: string;

    @OneToMany(() => DepositEntity, deposit => deposit.bank)
    deposits: DepositEntity[];
}