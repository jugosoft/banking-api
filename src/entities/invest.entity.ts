import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BankEntity } from './bank.entity';
import { DepositTypeEntity } from './deposit-type.entity';
import { InvestSnapshotEntity } from './invest-snapshot.entity';

@Entity('invest')
export class InvestEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    archived: boolean;

    @Column({ nullable: true })
    userId?: number;

    @Column({ nullable: true })
    bankId?: number;

    @Column({ nullable: true })
    depositTypeId?: number;

    @CreateDateColumn()
    startDate: Date;

    @ManyToOne(() => UserEntity, user => user.invests, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;

    @ManyToOne(() => BankEntity, bank => bank.invests, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'bankId' })
    bank?: BankEntity;

    @ManyToOne(() => DepositTypeEntity, depositType => depositType.invests, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'depositTypeId' })
    depositType?: DepositTypeEntity;

    @OneToMany(() => InvestSnapshotEntity, snapshot => snapshot.invest, { eager: true })
    snapshots: InvestSnapshotEntity[];
}
