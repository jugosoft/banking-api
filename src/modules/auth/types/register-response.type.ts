import { IApiResponse } from '@common/types';
import { IUserInfo } from '@common/types/user';
import { TokenPair } from './tokens.type';

export interface IRegisterResponse extends IApiResponse<IUserInfo & TokenPair> {
}