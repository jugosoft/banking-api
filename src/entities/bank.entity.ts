import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DepositEntity } from './deposit.entity';
import { InvestEntity } from './invest.entity';

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

    @OneToMany(() => InvestEntity, invest => invest.bank)
    invests: InvestEntity[];
}
