import { makeAnswer } from 'tests/factories/forum/make-answer'
import { makeQuestion } from 'tests/factories/forum/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/forum/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'tests/repositories/forum/in-memory-answers-repository'
import { InMemoryAttachmentsRepository } from 'tests/repositories/forum/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/forum/in-memory-students-repository'
import { InMemoryNotificationsRepository } from 'tests/repositories/notification/in-memory-notifications-repository'
import { waitFor } from 'tests/utils/wait-for'
import type { MockInstance } from 'vitest'
import {
	SendNotificationUseCase,
	type SendNotificationUseCaseRequest,
	type SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-questions-best-answer-chosen'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
	(
		request: SendNotificationUseCaseRequest,
	) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentsRepository,
			inMemoryStudentsRepository,
		)
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		)

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

		new OnQuestionBestAnswerChosen(
			inMemoryAnswersRepository,
			sendNotificationUseCase,
		)
	})

	it('should send a notification when question has a new best answer chosen', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({ questionId: question.id })

		await inMemoryQuestionRepository.create(question)
		await inMemoryAnswersRepository.create(answer)

		question.bestAnswerId = answer.id

		await inMemoryQuestionRepository.save(question)

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled()
		})
	})
})
