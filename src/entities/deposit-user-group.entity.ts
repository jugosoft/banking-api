import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('deposit_user_group')
export class UserGroupEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    ownerId: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => UserEntity, user => user.group)
    users: UserEntity[];
}
