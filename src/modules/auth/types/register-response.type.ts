import { UserInfo, IApiResponse } from '@common/types';
import { Tokens } from './tokens.type';

export interface ILoginResponse extends IApiResponse<UserInfo & Tokens> {
}