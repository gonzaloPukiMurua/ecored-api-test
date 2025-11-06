/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

console.log('🔧 Inicializando TypeORM CLI configuration...');

const dbUrl = process.env.DB_URL;

let dataSourceOptions;

if (dbUrl) {
  console.log('🌐 Usando conexión por DB_URL');
  dataSourceOptions = {
    type: 'postgres',
    url: dbUrl,
    ssl: {
      rejectUnauthorized: false, // requerido para Neon
    },
    entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    synchronize: false,
  };
} else {
  console.log('📦 Usando configuración manual (HOST, PORT, USER...)');

  const caPath = process.env.SSL_CA_CERT
    ? path.resolve(process.env.SSL_CA_CERT)
    : undefined;

  const sslCa =
    caPath && fs.existsSync(caPath)
      ? fs.readFileSync(caPath).toString()
      : undefined;

  const sslConfig = sslCa
    ? { rejectUnauthorized: true, ca: sslCa }
    : process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: false }
    : undefined;

  dataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslConfig,
    entities: [path.join(__dirname, '../**/*.entity.{ts,js}')],
    migrations: [path.join(__dirname, '../migrations/*.{ts,js}')],
    synchronize: false,
  };
}

export const AppDataSource = new DataSource(dataSourceOptions);
