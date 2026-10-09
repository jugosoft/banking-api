import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { DepositEntity } from './deposit.entity';
import { InvestEntity } from './invest.entity';
import { UserGroupEntity } from './deposit-user-group.entity';

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
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    hashedRT: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    patronymic: string;

    @Column({ nullable: true })
    groupId: number;

    @ManyToOne(() => UserGroupEntity, group => group.users, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'groupId' })
    group: UserGroupEntity;

    @OneToMany(() => DepositEntity, deposit => deposit.user)
    deposits: DepositEntity[];

    @OneToMany(() => InvestEntity, invest => invest.user)
    invests: InvestEntity[];
}
