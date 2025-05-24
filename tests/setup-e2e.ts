import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { DomainEvents } from '@/core/events/domain-events'
import { envSchema } from '@/infra/env'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Redis } from 'ioredis'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

const prisma = new PrismaClient()
const redis = new Redis({
	host: env.REDIS_HOST,
	port: env.REDIS_PORT,
	db: env.REDIS_DB,
})

function generateUniqueDatabaseUrl(schemaId: string) {
	if (!env.DATABASE_URL) {
		throw new Error('Please provide a DATABASE_URL via environment variables')
	}

	const url = new URL(env.DATABASE_URL)
	url.searchParams.set('schema', schemaId)

	return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
	const databaseUrl = generateUniqueDatabaseUrl(schemaId)

	process.env.DATABASE_URL = databaseUrl
	DomainEvents.shouldRun = false

	await redis.flushdb()

	execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
	await prisma.$disconnect()
})
