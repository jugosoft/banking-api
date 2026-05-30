import { BankEntity } from '@entities';

export class BankResponseDto {
    readonly id: number;
    readonly name: string;
    readonly shortName: string;

    private constructor(id: number, name: string, shortName: string) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
    }

    static fromEntity(bank: BankEntity): BankResponseDto {
        return new BankResponseDto(bank.id, bank.name, bank.shortName);
    }
}