import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestionComment } from 'tests/factories/forum/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/forum/in-memory-question-comments-repository'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Comment on Question', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to delete a question comment', async () => {
		const questionComment = makeQuestionComment()

		await inMemoryQuestionCommentsRepository.create(questionComment)

		await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		})

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user question comment', async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityId('author-1'),
		})

		await inMemoryQuestionCommentsRepository.create(questionComment)

		const result = await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: 'another-author-1',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
