import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('deposit')
export class Deposit {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column()
    rate: number;

    @Column()
    term: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    archived: boolean;

    @Column({ nullable: true })
    userId?: number;

    @ManyToOne(() => UserEntity, user => user.deposits, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'userId' })
    user?: UserEntity;
}