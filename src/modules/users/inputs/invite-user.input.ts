import { IsString } from 'class-validator';

export class InviteUserInput {
    @IsString()
    username: string;
}
