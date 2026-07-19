import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { DepositEntity } from './deposit.entity';
import { InvestEntity } from './invest.entity';
import { DepositGroupEntity } from './deposit-group.entity';

@Entity('deposit_type')
export class DepositTypeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    depositGroupId?: number;

    @ManyToOne(() => DepositGroupEntity, group => group.depositTypes, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'depositGroupId' })
    depositGroup?: DepositGroupEntity;

    @OneToMany(() => DepositEntity, deposit => deposit.depositType)
    deposits: DepositEntity[];

    @OneToMany(() => InvestEntity, invest => invest.depositType)
    invests: InvestEntity[];
}
