import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'tests/factories/forum/make-answer'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { beforeAll } from 'vitest'
import { AppModule } from '../../app.module'

describe('Fetch question answers (E2E)', () => {
	let app: INestApplication
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
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	}, 2000)

	test('[GET] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionId = question.id.toString()

		await Promise.all([
			answerFactory.makePrismaAnswer({
				authorId: user.id,
				questionId: question.id,
				content: 'Answer 1',
			}),
			answerFactory.makePrismaAnswer({
				authorId: user.id,
				questionId: question.id,
				content: 'Answer 2',
			}),
		])

		const response = await request(app.getHttpServer())
			.get(`/questions/${questionId}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			answers: expect.arrayContaining([
				expect.objectContaining({
					content: 'Answer 1',
				}),
				expect.objectContaining({
					content: 'Answer 2',
				}),
			]),
		})
	})
})
