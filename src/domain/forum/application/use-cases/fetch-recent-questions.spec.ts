import { makeQuestion } from 'tests/factories/forum/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to fetch recent questions', async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2025, 2, 20) }),
		)
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2025, 2, 21) }),
		)
		await inMemoryQuestionsRepository.create(
			makeQuestion({ createdAt: new Date(2025, 2, 18) }),
		)

		const result = await sut.execute({ page: 1 })

		expect(result.isRight()).toBe(true)

		if (result.isRight()) {
			expect(result.value.questions).toEqual([
				expect.objectContaining({ createdAt: new Date(2025, 2, 21) }),
				expect.objectContaining({ createdAt: new Date(2025, 2, 20) }),
				expect.objectContaining({ createdAt: new Date(2025, 2, 18) }),
			])
		}
	})

	it('should be able to fetch paginated recent questions', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionsRepository.create(
				makeQuestion({ createdAt: new Date(2025, 2, 20) }),
			)
		}

		const result = await sut.execute({ page: 2 })

		expect(result.isRight()).toBe(true)

		if (result.isRight()) {
			expect(result.value.questions).toHaveLength(2)
		}
	})

	it('should not be able to access an out of range page', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionsRepository.create(
				makeQuestion({ createdAt: new Date(2025, 2, 20) }),
			)
		}

		const result = await sut.execute({ page: 3 })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
