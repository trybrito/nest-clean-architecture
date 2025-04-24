import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentsRepository } from 'tests/repositories/forum/in-memory-question-comments-repository'
import { makeQuestion } from 'tests/factories/forum/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()
		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentsRepository,
		)
	})

	it('should be able to create a comment on a question', async () => {
		const question = makeQuestion()

		await inMemoryQuestionsRepository.create(question)

		const result = await sut.execute({
			authorId: question.authorId.toString(),
			questionId: question.id.toString(),
			content: 'Test comment on question',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
			'Test comment on question',
		)
	})
})
