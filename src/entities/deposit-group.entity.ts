import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DepositTypeEntity } from './deposit-type.entity';

@Entity('deposit_group')
export class DepositGroupEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    code: string;

    @OneToMany(() => DepositTypeEntity, depositType => depositType.depositGroup)
    depositTypes: DepositTypeEntity[];
}
