import { BankEntity, DepositTypeEntity, UserEntity } from '@entities';
import { BankResponseDto } from '@modules/reference/dto/bank-response.dto';
import { DepositTypeResponseDto } from '@modules/reference/dto/deposit-type-response.dto';
import { UserResponseDto } from '@modules/users/dto/user-response.dto';
import { DepositEntity } from 'src/entities/deposit.entity';

export class DepositResponseDto {
    readonly id: number;
    readonly amount: number;
    readonly percent: number;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly user: UserResponseDto;
    readonly bank: BankResponseDto;
    readonly depositType: DepositTypeResponseDto;

    private constructor(
        id: number,
        amount: number,
        percent: number,
        startDate: Date,
        endDate: Date,
        // user: UserResponseDto,
        // bank: BankResponseDto,
        // depositType: DepositTypeResponseDto
    ) {
        this.id = id;
        this.amount = amount;
        this.percent = percent;
        this.startDate = startDate;
        this.endDate = endDate;
        // this.user = user;
        // this.bank = bank;
        // this.depositType = depositType;
    }

    static fromEntity(deposit: DepositEntity): DepositResponseDto {
        return new DepositResponseDto(
            deposit.id,
            deposit.amount,
            deposit.percent,
            deposit.startDate,
            deposit.endDate,
            // UserResponseDto.fromEntity(user),
            // BankResponseDto.fromEntity(bank),
            // DepositTypeResponseDto.fromEntity(depositType)
        );
    }
}