import { IApiResponse } from '@common/types';
import { IUserInfo } from '@common/types/user';
import { TokenPair } from './tokens.type';

export interface ILoginResponse extends IApiResponse<IUserInfo & TokenPair> {
}