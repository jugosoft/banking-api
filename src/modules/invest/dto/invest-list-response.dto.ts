import { BankResponseDto } from '@modules/reference/dto/bank-response.dto';
import { DepositTypeResponseDto } from '@modules/reference/dto/deposit-type-response.dto';
import { InvestEntity } from '@entities';

export class InvestListItemResponseDto {
    readonly id: number;
    readonly amount: number;
    readonly startDate: Date;
    readonly bank: BankResponseDto;
    readonly depositType: DepositTypeResponseDto;

    private constructor(
        id: number,
        amount: number,
        startDate: Date,
        bank: BankResponseDto,
        depositType: DepositTypeResponseDto
    ) {
        this.id = id;
        this.amount = amount;
        this.startDate = startDate;
        this.bank = bank;
        this.depositType = depositType;
    }

    static fromEntity(invest: InvestEntity): InvestListItemResponseDto {
        return new InvestListItemResponseDto(
            invest.id,
            invest.amount,
            invest.startDate,
            BankResponseDto.fromEntity(invest.bank),
            DepositTypeResponseDto.fromEntity(invest.depositType)
        );
    }
}
