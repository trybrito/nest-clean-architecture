import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { makeQuestion } from 'tests/factories/forum/make-question'
import { makeQuestionAttachment } from 'tests/factories/forum/make-question-attachment'
import { InMemoryAttachmentsRepository } from 'tests/repositories/forum/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/forum/in-memory-students-repository'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
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

		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		)
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

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

		await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'author-1',
			title: 'Example Title',
			content: 'Example content',
			attachmentsIds: ['1', '3'],
		})

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: 'Example Title',
			content: 'Example content',
		})

		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({
				attachmentId: new UniqueEntityId('1'),
			}),
			expect.objectContaining({
				attachmentId: new UniqueEntityId('3'),
			}),
		])
	})

	it('should not be able to edit questions from other users', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'different-author-1',
			title: 'Example Title',
			content: 'Example content',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})

	it('should sync new and removed attachments when editing an attachment', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-1'),
			},
			new UniqueEntityId('question-1'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

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

		const result = await sut.execute({
			questionId: newQuestion.id.toString(),
			authorId: 'author-1',
			title: 'Example Title',
			content: 'Example content',
			attachmentsIds: ['1', '3'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
				expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
			]),
		)
	})
})
