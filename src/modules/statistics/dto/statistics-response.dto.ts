export class StatisticsResponseDto {
    readonly totalAmount: number;
    readonly totalInterest: number;
    readonly currentIncome: number;
    readonly nearestDepositClosingInfo: INearestDepositClosingInfo;

    private constructor(
        totalAmount: number,
        totalInterest: number,
        currentIncome: number,
        nearestDepositClosingInfo: INearestDepositClosingInfo
    ) {
        this.totalAmount = totalAmount;
        this.totalInterest = totalInterest;
        this.currentIncome = currentIncome;
        this.nearestDepositClosingInfo = nearestDepositClosingInfo;
    }

    static create(
        totalAmount: number,
        totalInterest: number,
        currentIncome: number,
        nearestDepositClosingInfo: INearestDepositClosingInfo
    ): StatisticsResponseDto {
        return new StatisticsResponseDto(totalAmount, totalInterest, currentIncome, nearestDepositClosingInfo);
    }
}

export interface INearestDepositClosingInfo {
    readonly id: number;
    readonly bankName: string;
    readonly closeDate: Date;
}
