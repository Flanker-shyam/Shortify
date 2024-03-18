import { registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.NODE_ENV==="development"? process.env.DATABASE_NAME: process.env.DATABASE_NAME_TEST,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
}

console.log(config.database);
console.log(process.env.NODE_ENV);

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);