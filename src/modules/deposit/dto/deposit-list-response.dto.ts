import { BankResponseDto } from '@modules/reference/dto/bank-response.dto';
import { DepositTypeResponseDto } from '@modules/reference/dto/deposit-type-response.dto';
import { DepositEntity } from 'src/entities/deposit.entity';

export class DepositListItemResponseDto {
    readonly id: number;
    readonly amount: number;
    readonly percent: number;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly bank: BankResponseDto;
    readonly depositType: DepositTypeResponseDto;

    private constructor(
        id: number,
        amount: number,
        percent: number,
        startDate: Date,
        endDate: Date,
        bank: BankResponseDto,
        depositType: DepositTypeResponseDto
    ) {
        this.id = id;
        this.amount = amount;
        this.percent = percent;
        this.startDate = startDate;
        this.endDate = endDate;
        this.bank = bank;
        this.depositType = depositType;
    }

    static fromEntity(deposit: DepositEntity): DepositListItemResponseDto {
        return new DepositListItemResponseDto(
            deposit.id,
            deposit.amount,
            deposit.percent,
            deposit.startDate,
            deposit.endDate,
            BankResponseDto.fromEntity(deposit.bank),
            DepositTypeResponseDto.fromEntity(deposit.depositType)
        );
    }
}