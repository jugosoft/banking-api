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
    readonly capitalization: boolean;
    readonly user: UserResponseDto;
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
        user: UserResponseDto,
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
        this.user = user;
        this.bank = bank;
        this.depositType = depositType;
        this.groupOwner = groupOwner;
    }

    static fromEntity(deposit: DepositEntity, groupOwner?: UserResponseDto): DepositResponseDto {
        return new DepositResponseDto(
            deposit.id,
            deposit.amount,
            Number(deposit.percent),
            deposit.startDate,
            deposit.endDate,
            deposit.capitalization,
            UserResponseDto.fromEntity(deposit.user!),
            BankResponseDto.fromEntity(deposit.bank!),
            DepositTypeResponseDto.fromEntity(deposit.depositType!),
            groupOwner
        );
    }
}
