import { makeAnswer } from 'tests/factories/forum/make-answer'
import { makeQuestion } from 'tests/factories/forum/make-question'
import { InMemoryAnswersRepository } from 'tests/repositories/forum/in-memory-answers-repository'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { InMemoryNotificationsRepository } from 'tests/repositories/notification/in-memory-notifications-repository'
import { waitFor } from 'tests/utils/wait-for'
import type { MockInstance } from 'vitest'
import {
	SendNotificationUseCase,
	type SendNotificationUseCaseRequest,
	type SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-questions-best-answer-chosen'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
	(
		request: SendNotificationUseCaseRequest,
	) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Best Answer Chosen', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
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
