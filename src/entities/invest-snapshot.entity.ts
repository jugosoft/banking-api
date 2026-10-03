import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InvestEntity } from './invest.entity';

@Entity('invest_snapshot')
export class InvestSnapshotEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'timestamp' })
    date: Date;

    @ManyToOne(() => InvestEntity, invest => invest.snapshots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'investId' })
    invest: InvestEntity;

    @Column()
    investId: number;
}
