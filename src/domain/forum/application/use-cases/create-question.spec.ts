import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to create a question', async () => {
		const result = await sut.execute({
			authorId: '1',
			title: 'New Question',
			content: 'Test question',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value.question)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityId('1'),
				questionId: result.value.question.id,
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityId('2'),
				questionId: result.value.question.id,
			}),
		])
	})

	it('should persist attachments when creating a new question', async () => {
		const result = await sut.execute({
			authorId: '1',
			title: 'New Question',
			content: 'Test question',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
				expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
			]),
		)
	})
})
