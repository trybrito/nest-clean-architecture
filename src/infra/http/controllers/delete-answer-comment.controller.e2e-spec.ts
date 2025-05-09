import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'tests/factories/forum/make-answer'
import { AnswerCommentFactory } from 'tests/factories/forum/make-answer-comment'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Delete answer comment (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let answerFactory: AnswerFactory
	let answerCommentFactory: AnswerCommentFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AnswerFactory,
				AnswerCommentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		answerFactory = moduleRef.get(AnswerFactory)
		answerCommentFactory = moduleRef.get(AnswerCommentFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	}, 2000)

	test('[DELETE] /answers/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		})

		const answerComment = await answerCommentFactory.makePrismaAnswerComment({
			authorId: user.id,
			answerId: answer.id,
		})

		const answerCommentId = answerComment.id.toString()

		const response = await request(app.getHttpServer())
			.delete(`/answers/comments/${answerCommentId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(204)

		const answerCommentOnDatabase = await prisma.comment.findUnique({
			where: {
				id: answerCommentId,
			},
		})

		expect(answerCommentOnDatabase).toBeNull()
	})
})
