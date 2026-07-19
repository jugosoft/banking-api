import { DepositGroupEntity } from '@entities';

export class DepositGroupResponseDto {
    readonly id: number;
    readonly name: string;
    readonly code: string;

    private constructor(id: number, name: string, code: string) {
        this.id = id;
        this.name = name;
        this.code = code;
    }

    static fromEntity(depositGroup: DepositGroupEntity): DepositGroupResponseDto {
        return new DepositGroupResponseDto(depositGroup.id, depositGroup.name, depositGroup.code);
    }
}
