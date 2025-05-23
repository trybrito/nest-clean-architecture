import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'tests/factories/forum/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'tests/repositories/forum/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'tests/repositories/forum/in-memory-answers-repository'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
	})

	it('should be able to fetch question answers', async () => {
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-1') }),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-1') }),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-2') }),
		)

		const result = await sut.execute({ questionId: 'question-1', page: 1 })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.answers).toHaveLength(2)
		}
	})

	it('should be able to fetch paginated question answers', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({ questionId: new UniqueEntityId('question-1') }),
			)
		}

		const result = await sut.execute({ questionId: 'question-1', page: 2 })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.answers).toHaveLength(2)
		}
	})

	it('should not be able to access an out of range page', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({ questionId: new UniqueEntityId('question-1') }),
			)
		}

		const result = await sut.execute({ questionId: 'question-1', page: 3 })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
