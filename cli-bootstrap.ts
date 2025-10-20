/* eslint-disable prettier/prettier */
// cli-bootstrap.ts (en la raíz del proyecto)
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carga explícita y forzada del archivo que tiene tus credenciales de BD.
// Usa '.env.development' si ese es el que tiene la contraseña real.
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.example';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
// También carga el .env general si lo tienes.
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true }); 

console.log('CLI Bootstrap: DB_USER loaded?', !!process.env.DB_USER); 
console.log('CLI Bootstrap: DB_PASSWORD length:', process.env.DB_PASSWORD ? 'Loaded' : 'Undefined!');