import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserGroupEntity } from './deposit-user-group.entity';

@Entity('user_group_invites')
export class UserGroupInviteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    groupId: number;

    @Column()
    inviterId: number;

    @Column()
    inviteeUsername: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => UserGroupEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'groupId' })
    group: UserGroupEntity;

    @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'inviterId' })
    inviter: UserEntity;
}
