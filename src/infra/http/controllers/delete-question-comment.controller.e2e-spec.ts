import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { QuestionCommentFactory } from 'tests/factories/forum/make-question-comment'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Delete question comment (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let questionCommentFactory: QuestionCommentFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		questionCommentFactory = moduleRef.get(QuestionCommentFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	}, 2000)

	test('[DELETE] /questions/comments/:id', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionComment =
			await questionCommentFactory.makePrismaQuestionComment({
				authorId: user.id,
				questionId: question.id,
			})

		const questionCommentId = questionComment.id.toString()

		const response = await request(app.getHttpServer())
			.delete(`/questions/comments/${questionCommentId}`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(204)

		const questionCommentOnDatabase = await prisma.comment.findUnique({
			where: {
				id: questionCommentId,
			},
		})

		expect(questionCommentOnDatabase).toBeNull()
	})
})
