import { InvestEntity } from '@entities';
import { BankResponseDto } from '@modules/reference/dto/bank-response.dto';
import { DepositTypeResponseDto } from '@modules/reference/dto/deposit-type-response.dto';
import { UserResponseDto } from '@modules/users/dto/user-response.dto';
import { InvestSnapshotEntity } from '@entities';

export class InvestSnapshotResponseDto {
    readonly amount: number;
    readonly date: Date;

    constructor(amount: number, date: Date) {
        this.amount = amount;
        this.date = date;
    }

    static fromEntity(snapshot: InvestSnapshotEntity): InvestSnapshotResponseDto {
        return new InvestSnapshotResponseDto(
            Number(snapshot.amount),
            snapshot.date
        );
    }
}

export class InvestResponseDto {
    readonly id: number;
    readonly amount: number;
    readonly startDate: Date;
    readonly user: UserResponseDto;
    readonly bank: BankResponseDto;
    readonly depositType: DepositTypeResponseDto;
    readonly history: InvestSnapshotResponseDto[];

    private constructor(
        id: number,
        amount: number,
        startDate: Date,
        user: UserResponseDto,
        bank: BankResponseDto,
        depositType: DepositTypeResponseDto,
        history: InvestSnapshotResponseDto[]
    ) {
        this.id = id;
        this.amount = amount;
        this.startDate = startDate;
        this.user = user;
        this.bank = bank;
        this.depositType = depositType;
        this.history = history;
    }

    static fromEntity(invest: InvestEntity): InvestResponseDto {
        const history = invest.snapshots?.map(snapshot =>
            InvestSnapshotResponseDto.fromEntity(snapshot)
        ) ?? [];

        return new InvestResponseDto(
            invest.id,
            invest.amount,
            invest.startDate,
            UserResponseDto.fromEntity(invest.user!),
            BankResponseDto.fromEntity(invest.bank!),
            DepositTypeResponseDto.fromEntity(invest.depositType!),
            history
        );
    }
}
