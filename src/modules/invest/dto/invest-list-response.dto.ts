import { BankResponseDto } from '@modules/reference/dto/bank-response.dto';
import { DepositTypeResponseDto } from '@modules/reference/dto/deposit-type-response.dto';
import { InvestEntity, InvestSnapshotEntity } from '@entities';

export class InvestSnapshotListResponseDto {
    readonly amount: number;
    readonly date: Date;

    constructor(amount: number, date: Date) {
        this.amount = amount;
        this.date = date;
    }

    static fromEntity(snapshot: InvestSnapshotEntity): InvestSnapshotListResponseDto {
        return new InvestSnapshotListResponseDto(
            Number(snapshot.amount),
            snapshot.date
        );
    }
}

export class InvestListItemResponseDto {
    readonly id: number;
    readonly amount: number;
    readonly startDate: Date;
    readonly bank: BankResponseDto;
    readonly depositType: DepositTypeResponseDto;
    readonly history: InvestSnapshotListResponseDto[];

    private constructor(
        id: number,
        amount: number,
        startDate: Date,
        bank: BankResponseDto,
        depositType: DepositTypeResponseDto,
        history: InvestSnapshotListResponseDto[]
    ) {
        this.id = id;
        this.amount = amount;
        this.startDate = startDate;
        this.bank = bank;
        this.depositType = depositType;
        this.history = history;
    }

    static fromEntity(invest: InvestEntity): InvestListItemResponseDto {
        const history = invest.snapshots?.map(snapshot =>
            InvestSnapshotListResponseDto.fromEntity(snapshot)
        ) ?? [];

        return new InvestListItemResponseDto(
            invest.id,
            invest.amount,
            invest.startDate,
            BankResponseDto.fromEntity(invest.bank),
            DepositTypeResponseDto.fromEntity(invest.depositType),
            history
        );
    }
}
