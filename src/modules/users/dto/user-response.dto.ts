import { UserEntity } from '@entities';

export class UserResponseDto {
    readonly id: number;
    readonly email: string;
    readonly username: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly patronymic?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    private constructor(
        id: number,
        email: string,
        username: string,
        firstName: string | undefined,
        lastName: string | undefined,
        patronymic: string | undefined,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.patronymic = patronymic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(user: UserEntity): UserResponseDto {
        return new UserResponseDto(
            user.id,
            user.email,
            user.username,
            user.firstName,
            user.lastName,
            user.patronymic,
            user.createdAt,
            user.updatedAt
        );
    }
}
