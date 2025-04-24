import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'tests/repositories/forum/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
	})

	it('should be able to create an answer', async () => {
		const result = await sut.execute({
			questionId: '1',
			instructorId: '1',
			content: 'Test answer',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswersRepository.items[0]).toEqual(result.value.answer)
		expect(
			inMemoryAnswersRepository.items[0].attachments.currentItems,
		).toHaveLength(2)
		expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
			[
				expect.objectContaining({
					attachmentId: new UniqueEntityId('1'),
					answerId: result.value.answer.id,
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId('2'),
					answerId: result.value.answer.id,
				}),
			],
		)
	})
})
