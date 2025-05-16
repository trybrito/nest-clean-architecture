import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'tests/factories/forum/make-answer'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Choose question best answer (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let answerFactory: AnswerFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AnswerFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[PATCH] answers/:answerId/choose-as-best', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const answer = await answerFactory.makePrismaAnswer({
			questionId: question.id,
			authorId: user.id,
		})

		const answerId = answer.id.toString()

		const response = await request(app.getHttpServer())
			.patch(`/answers/${answerId}/choose-as-best`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(204)

		const questionOnDatabase = await prisma.question.findUnique({
			where: {
				id: question.id.toString(),
			},
		})

		expect(questionOnDatabase?.bestAnswerId).toEqual(answerId)
	})
})
