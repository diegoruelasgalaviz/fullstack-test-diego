export interface DatabaseConfig {
  host: string
  port: number
  username: string
  password: string
  database: string
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'fullstack_db',
  }
}
