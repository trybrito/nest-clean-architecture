import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'tests/factories/forum/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/forum/in-memory-question-comments-repository'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to fetch question comments', async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-2') }),
		)

		const result = await sut.execute({
			questionId: 'question-1',
			page: 1,
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.questionComments).toHaveLength(2)
		}
	})

	it('should be able to fetch paginated question comments', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
			)
		}

		const result = await sut.execute({
			questionId: 'question-1',
			page: 2,
		})

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.questionComments).toHaveLength(2)
		}
	})

	it('should not be able to access an out of range page', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('question-1') }),
			)
		}

		const result = await sut.execute({ questionId: 'question-1', page: 3 })

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
