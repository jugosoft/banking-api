import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserGroupInviteEntity } from './user-group-invite.entity';

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

    @OneToMany(() => UserGroupInviteEntity, invite => invite.group)
    invites: UserGroupInviteEntity[];
}
