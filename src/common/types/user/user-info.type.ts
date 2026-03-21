import { UserEntity } from '@entities';

export type UserInfo = {
    readonly id: number;
    readonly email: string;
    readonly name: string;
    readonly roles: { readonly id: number; readonly name: string }[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
};