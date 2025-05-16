import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Comment on question (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /questions/:questionId/comments', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionId = question.id.toString()

		const response = await request(app.getHttpServer())
			.post(`/questions/${questionId}/comments`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New Comment',
			})

		expect(response.statusCode).toBe(201)

		const questionCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				content: 'New Comment',
			},
		})

		expect(questionCommentOnDatabase).toBeTruthy()
	})
})
