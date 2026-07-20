import { DepositGroupEntity, DepositTypeEntity } from '@entities';
import { DepositGroupResponseDto } from './deposit-group-response.dto';

export class DepositTypeResponseDto {
    public readonly id: number;
    public readonly name: string;
    public readonly depositGroup: DepositGroupResponseDto;

    private constructor(id: number, name: string, depositGroup: DepositGroupResponseDto) {
        this.id = id;
        this.name = name;
        this.depositGroup = depositGroup;
    }

    static fromEntity(depositType: DepositTypeEntity): DepositTypeResponseDto {
        return new DepositTypeResponseDto(
            depositType.id,
            depositType.name,
            DepositGroupResponseDto.fromEntity(depositType.depositGroup)
        );
    }
}
