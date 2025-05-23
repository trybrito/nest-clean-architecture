import { DomainEvents } from '@/core/events/domain-events'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'tests/factories/forum/make-question'
import { StudentFactory } from 'tests/factories/forum/make-student'
import { waitFor } from 'tests/utils/wait-for'
import { AppModule } from '../app.module'
import { PrismaService } from '../database/prisma/prisma.service'

describe('On answer created (E2E)', () => {
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

		DomainEvents.shouldRun = true

		await app.init()
	})

	it('send a notification when answer is created', async () => {
		const user = await studentFactory.makePrismaStudent()

		const accessToken = jwt.sign({ sub: user.id.toString() })

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		})

		const questionId = question.id.toString()

		await request(app.getHttpServer())
			.post(`/questions/${questionId}/answers`)
			.set('Authorization', `Bearer ${accessToken}`)
			.send({
				content: 'New Answer',
				attachments: [],
			})

		await waitFor(async () => {
			const notificationOnDatabase = await prisma.notification.findFirst({
				where: {
					recipientId: user.id.toString(),
				},
			})

			expect(notificationOnDatabase).not.toBeNull()
		})
	})
})
