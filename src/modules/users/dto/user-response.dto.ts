import { UserEntity } from '@entities';

export class UserResponseDto {
    readonly id: number;
    readonly email: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    private constructor(
        id: number,
        email: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromEntity(user: UserEntity): UserResponseDto {
        return new UserResponseDto(
            user.id,
            user.email,
            user.createdAt,
            user.updatedAt
        );
    }
}