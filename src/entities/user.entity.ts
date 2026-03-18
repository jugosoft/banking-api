import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

import { RoleEntity } from './role.entity';
import { Deposit } from './deposit.entity';


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ unique: true })
    email: string;

    @ManyToMany(() => RoleEntity)
    @JoinTable()
    roles: RoleEntity[];

    @Column({ unique: true })
    name: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    hashedRT: string;

    @OneToMany(() => Deposit, deposit => deposit.user)
    deposits: Deposit[];
}
