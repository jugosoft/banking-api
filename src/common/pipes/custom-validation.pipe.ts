import { ArgumentMetadata, BadRequestException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { IApiResponse } from '@common/types';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            const formattedErrors = errors.flatMap((err) => {
                const constraints = err.constraints ? Object.values(err.constraints) : ['Invalid field'];
                return constraints.map(message => ({
                    code: err.property,
                    message: message as string,
                }));
            });

            const errorResponse: IApiResponse<null> = {
                success: false,
                statusCode: HttpStatus.BAD_REQUEST,
                errors: formattedErrors,
            };

            throw new BadRequestException(errorResponse);
        }

        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.some((type) => metatype === type);
    }
}