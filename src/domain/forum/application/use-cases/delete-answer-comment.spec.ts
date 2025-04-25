import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeAnswerComment } from 'tests/factories/forum/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'tests/repositories/forum/in-memory-answer-comments-repository'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Comment on Answer', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to delete an answer comment', async () => {
		const answerComment = makeAnswerComment()

		await inMemoryAnswerCommentsRepository.create(answerComment)

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		})

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityId('author-1'),
		})

		await inMemoryAnswerCommentsRepository.create(answerComment)

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: 'another-author-1',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
