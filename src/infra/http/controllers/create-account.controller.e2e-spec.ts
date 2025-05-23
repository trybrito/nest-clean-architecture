import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Create account (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)

		await app.init()
	})

	test('[POST] /accounts', async () => {
		const response = await request(app.getHttpServer()).post('/accounts').send({
			name: 'John Doe',
			email: 'doe@example.com',
			password: '123456',
		})

		expect(response.statusCode).toBe(201)

		const createdUser = await prisma.user.findUnique({
			where: {
				email: 'doe@example.com',
			},
		})

		expect(createdUser).toBeTruthy()
	})
})
