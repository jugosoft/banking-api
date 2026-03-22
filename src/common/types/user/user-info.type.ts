import { UserEntity } from '@entities';

export interface IUserInfo {
    readonly id: number;
    readonly email: string;
    readonly username: string;
    readonly roles: { readonly id: number; readonly name: string }[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
};

export interface IUserName {
    readonly username: string;
}