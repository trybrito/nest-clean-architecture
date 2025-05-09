import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'

describe('Authenticate (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)

		await app.init()
	}, 2000)

	test('[POST] /sessions', async () => {
		await studentFactory.makePrismaStudent({
			email: 'doe@example.com',
			password: await hash('123456', 8),
		})

		const response = await request(app.getHttpServer()).post('/sessions').send({
			email: 'doe@example.com',
			password: '123456',
		})

		expect(response.statusCode).toBe(201)
		expect(response.body).toEqual({
			access_token: expect.any(String),
		})
	})
})
