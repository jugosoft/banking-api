import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DepositEntity } from './deposit.entity';
import { InvestEntity } from './invest.entity';

@Entity('deposit_type')
export class DepositTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => DepositEntity, deposit => deposit.depositType)
    deposits: DepositEntity[];

    @OneToMany(() => InvestEntity, invest => invest.depositType)
    invests: InvestEntity[];
}
