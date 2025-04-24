import { makeAnswer } from 'tests/factories/forum/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'tests/repositories/forum/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import {
	SendNotificationUseCase,
	type SendNotificationUseCaseResponse,
	type SendNotificationUseCaseRequest,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'tests/repositories/notification/in-memory-notifications-repository'
import { makeQuestion } from 'tests/factories/forum/make-question'
import type { MockInstance } from 'vitest'
import { waitFor } from 'tests/utils/wait-for'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
	(
		request: SendNotificationUseCaseRequest,
	) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		inMemoryQuestionRepository = new InMemoryQuestionsRepository()
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		)

		sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

		new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationUseCase)
	})

	it('should send a notification when a new answer is created', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({ questionId: question.id })

		await inMemoryQuestionRepository.create(question)
		await inMemoryAnswersRepository.create(answer)

		await waitFor(() => {
			expect(sendNotificationExecuteSpy).toHaveBeenCalled()
		})
	})
})
