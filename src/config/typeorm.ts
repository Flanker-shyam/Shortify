import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `localhost`,
    port: `5432`,
    username: `shyam.sunder`,
    password: `secret`,
    database: `url_shortner`,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);