import { UserInfo, IApiResponse } from '@common/types';
import { Tokens } from './tokens.type';

export interface IRegisterResponse extends IApiResponse<UserInfo & Tokens> {
}