import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/forum/in-memory-answer-comments-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'tests/factories/forum/make-answer-comment'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to fetch answer comments', async () => {
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
		)
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
		)
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-2') }),
		)

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 1,
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.answerComments).toHaveLength(2)
		}
	})

	it('should be able to fetch paginated answer comments', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
			)
		}

		const result = await sut.execute({
			answerId: 'answer-1',
			page: 2,
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.answerComments).toHaveLength(2)
		}
	})

	it('should not be able to access an out of range page', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('answer-1') }),
			)
		}

		const result = await sut.execute({ answerId: 'answer-1', page: 3 })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
