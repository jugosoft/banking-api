import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10) || 5432,
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [__dirname + '/**/entities/*{.ts,.js}'],
    logging: true,
    synchronize: false,
    migrationsRun: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    migrationsTableName: 'history',
});
