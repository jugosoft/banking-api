import { DepositTypeEntity } from '@entities';

export class DepositTypeResponseDto {
    readonly id: number;
    readonly name: string;

    private constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromEntity(depositType: DepositTypeEntity): DepositTypeResponseDto {
        return new DepositTypeResponseDto(depositType.id, depositType.name);
    }
}