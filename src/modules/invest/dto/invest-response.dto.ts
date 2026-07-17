import { BankEntity, DepositTypeEntity, InvestEntity, UserEntity } from '@entities';
import { BankResponseDto } from '@modules/reference/dto/bank-response.dto';
import { DepositTypeResponseDto } from '@modules/reference/dto/deposit-type-response.dto';
import { UserResponseDto } from '@modules/users/dto/user-response.dto';

export class InvestResponseDto {
    readonly id: number;
    readonly amount: number;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly user: UserResponseDto;
    readonly bank: BankResponseDto;
    readonly depositType: DepositTypeResponseDto;

    private constructor(
        id: number,
        amount: number,
        startDate: Date,
        endDate: Date,
        user: UserResponseDto,
        bank: BankResponseDto,
        depositType: DepositTypeResponseDto
    ) {
        this.id = id;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.user = user;
        this.bank = bank;
        this.depositType = depositType;
    }

    static fromEntity(invest: InvestEntity): InvestResponseDto {
        return new InvestResponseDto(
            invest.id,
            invest.amount,
            invest.startDate,
            invest.endDate,
            UserResponseDto.fromEntity(invest.user!),
            BankResponseDto.fromEntity(invest.bank!),
            DepositTypeResponseDto.fromEntity(invest.depositType!)
        );
    }
}
