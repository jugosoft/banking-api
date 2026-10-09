import { BankResponseDto } from '@modules/reference/dto/bank-response.dto';
import { DepositTypeResponseDto } from '@modules/reference/dto/deposit-type-response.dto';
import { UserResponseDto } from '@modules/users/dto/user-response.dto';
import { DepositEntity } from 'src/entities/deposit.entity';

export class DepositListItemResponseDto {
    readonly id: number;
    readonly amount: number;
    readonly percent: number;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly capitalization: boolean;
    readonly bank: BankResponseDto;
    readonly depositType: DepositTypeResponseDto;
    readonly groupOwner?: UserResponseDto;

    private constructor(
        id: number,
        amount: number,
        percent: number,
        startDate: Date,
        endDate: Date,
        capitalization: boolean,
        bank: BankResponseDto,
        depositType: DepositTypeResponseDto,
        groupOwner?: UserResponseDto
    ) {
        this.id = id;
        this.amount = amount;
        this.percent = percent;
        this.startDate = startDate;
        this.endDate = endDate;
        this.capitalization = capitalization;
        this.bank = bank;
        this.depositType = depositType;
        this.groupOwner = groupOwner;
    }

    static fromEntity(deposit: DepositEntity, groupOwner?: UserResponseDto): DepositListItemResponseDto {
        return new DepositListItemResponseDto(
            deposit.id,
            deposit.amount,
            Number(deposit.percent),
            deposit.startDate,
            deposit.endDate,
            deposit.capitalization,
            BankResponseDto.fromEntity(deposit.bank),
            DepositTypeResponseDto.fromEntity(deposit.depositType),
            groupOwner
        );
    }
}
