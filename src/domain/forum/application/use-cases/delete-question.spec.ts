import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'tests/factories/forum/make-question'
import { makeQuestionAttachment } from 'tests/factories/forum/make-question-attachment'
import { InMemoryAttachmentsRepository } from 'tests/repositories/forum/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/forum/in-memory-students-repository'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentRepository,
			inMemoryStudentsRepository,
		)

		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to delete a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		await sut.execute({ authorId: 'author-1', questionId: 'question-1' })

		expect(inMemoryQuestionsRepository.items).toHaveLength(0)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a question when authorId does not matches', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			authorId: 'different-author-1',
			questionId: 'question-1',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
