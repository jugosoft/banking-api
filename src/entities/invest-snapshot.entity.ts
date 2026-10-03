import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InvestEntity } from './invest.entity';

@Entity('invest_snapshot')
export class InvestSnapshotEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'datetime' })
    date: Date;

    @ManyToOne(() => InvestEntity, invest => invest.snapshots, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'investId' })
    invest: InvestEntity;

    @Column()
    investId: number;
}
