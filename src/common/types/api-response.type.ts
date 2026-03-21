import { HttpStatus } from '@nestjs/common';

export interface IApiResponse<T = null> {
    readonly success: boolean;
    readonly statusCode: HttpStatus;
    readonly data?: T;
    readonly errors?: IResponseErrors;
}

export interface IError {
    readonly code: string;
    readonly message: string;
}

export type IResponseErrors = IError[];
