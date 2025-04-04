import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const postgresConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'postgres',
  password: '123',
  database: 'nest',
  entities: [__dirname + '/**/*.entity.{ts,js}'],
  synchronize: true,
};
