import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { BankEntity } from './bank.entity';
import { DepositTypeEntity } from './deposit-type.entity';

@Entity('deposit')
export class DepositEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 4 })
    percent: number;

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

    @UpdateDateColumn()
    endDate: Date;

    @ManyToOne(() => UserEntity, user => user.deposits, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;

    @ManyToOne(() => BankEntity, bank => bank.deposits, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'bankId' })
    bank?: BankEntity;

    @ManyToOne(() => DepositTypeEntity, depositType => depositType.deposits, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'depositTypeId' })
    depositType?: DepositTypeEntity;
}