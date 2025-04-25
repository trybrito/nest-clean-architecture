import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Fetch recent questions (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /questions', async () => {
		const user = await prisma.user.create({
			data: {
				name: 'John Doe',
				email: 'doe@example.com',
				password: '123456',
			},
		})

		const accessToken = jwt.sign({ sub: user.id })

		await prisma.question.createMany({
			data: [
				{
					authorId: user.id,
					title: 'Question-1',
					slug: 'question-1',
					content: 'Content-1',
				},
				{
					authorId: user.id,
					title: 'Question-2',
					slug: 'question-2',
					content: 'Content-2',
				},
				{
					authorId: user.id,
					title: 'Question-3',
					slug: 'question-3',
					content: 'Content-3',
				},
			],
		})

		const response = await request(app.getHttpServer())
			.get('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			questions: [
				expect.objectContaining({
					title: 'Question-1',
				}),
				expect.objectContaining({
					title: 'Question-2',
				}),
				expect.objectContaining({
					title: 'Question-3',
				}),
			],
		})
	})
})
