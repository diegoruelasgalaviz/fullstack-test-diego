import 'reflect-metadata'
import { AppDataSource } from '@shared/infrastructure/database'
import { createApp } from './app'

const PORT = process.env.PORT ?? 4000

async function bootstrap() {
  try {
    await AppDataSource.initialize()
    console.log('Database connection established')

    const app = createApp(AppDataSource)

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('Error during initialization:', error)
    process.exit(1)
  }
}

bootstrap()
