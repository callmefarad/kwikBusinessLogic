import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD,SECRET_KEY } = process.env;

