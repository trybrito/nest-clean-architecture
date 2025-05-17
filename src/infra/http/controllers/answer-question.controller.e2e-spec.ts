import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'tests/factories/forum/make-attachments'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'
import { PrismaService } from '../../database/prisma/prisma.service'

describe('Answer question (E2E)', () => {
	let app: INestApplication
	let prisma: PrismaService
	let studentFactory: StudentFactory
	let attachmentFactory: AttachmentFactory
	let questionFactory: QuestionFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [StudentFactory, QuestionFactory, AttachmentFactory],
		}).compile()

		app = moduleRef.createNestApplication()
		prisma = moduleRef.get(PrismaService)
		studentFactory = moduleRef.get(StudentFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[POST] /questions/:questionId/answers', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionId = question.id.toString()

		const attachment1 = await attachmentFactory.makePrismaAttachment()
		const attachment2 = await attachmentFactory.makePrismaAttachment()

		const response = await request(app.getHttpServer())
			.post(`/questions/${questionId}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New Answer',
				attachments: [attachment1.id.toString(), attachment2.id.toString()],
			})

		expect(response.statusCode).toBe(201)

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: 'New Answer',
			},
		})

		expect(answerOnDatabase).toBeTruthy()

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				answerId: answerOnDatabase?.id,
			},
		})

		expect(attachmentsOnDatabase).toHaveLength(2)
	})
})
