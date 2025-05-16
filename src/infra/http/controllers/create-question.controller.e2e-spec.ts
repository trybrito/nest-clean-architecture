import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Create question (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let studentFactory: StudentFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		studentFactory = moduleRef.get(StudentFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /questions', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const response = await request(app.getHttpServer())
			.post('/questions')
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				title: 'New Question',
				content: 'New Content',
			})

		expect(response.statusCode).toBe(201)

		const createdQuestion = await prisma.question.findFirst({
			where: {
				title: 'New Question',
			},
		})

		expect(createdQuestion).toBeTruthy()
	})
})
