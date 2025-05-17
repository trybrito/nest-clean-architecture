import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'tests/factories/forum/make-attachments'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { QuestionAttachmentFactory } from 'tests/factories/forum/make-question-attachment'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { AppModule } from '../../app.module'

describe('Get question by slug (E2E)', () => {
	let app: INestApplication
	let studentFactory: StudentFactory
	let questionFactory: QuestionFactory
	let attachmentFactory: AttachmentFactory
	let questionAttachmentFactory: QuestionAttachmentFactory
	let jwt: JwtService

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [
				StudentFactory,
				QuestionFactory,
				AttachmentFactory,
				QuestionAttachmentFactory,
			],
		}).compile()

		app = moduleRef.createNestApplication()
		studentFactory = moduleRef.get(StudentFactory)
		questionFactory = moduleRef.get(QuestionFactory)
		attachmentFactory = moduleRef.get(AttachmentFactory)
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
		jwt = moduleRef.get(JwtService)

		await app.init()
	})

	test('[GET] /questions/:slug', async () => {
		const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
			title: 'Question-1',
			slug: Slug.create('question-1'),
		})

		const attachment = await attachmentFactory.makePrismaAttachment({
			title: 'Attachment title',
		})

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		})

		const response = await request(app.getHttpServer())
			.get('/questions/question-1')
			.set('Authorization', `Bearer ${accessToken}`)
			.send()

		expect(response.statusCode).toBe(200)
		expect(response.body).toEqual({
			question: expect.objectContaining({
				title: 'Question-1',
				author: 'John Doe',
				attachments: [expect.objectContaining({ title: 'Attachment title' })],
			}),
		})
	})
})
