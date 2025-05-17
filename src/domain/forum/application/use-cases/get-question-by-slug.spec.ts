import { makeAttachment } from 'tests/factories/forum/make-attachments'
import { makeQuestion } from 'tests/factories/forum/make-question'
import { makeQuestionAttachment } from 'tests/factories/forum/make-question-attachment'
import { makeStudent } from 'tests/factories/forum/make-student'
import { InMemoryAttachmentsRepository } from 'tests/repositories/forum/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'tests/repositories/forum/in-memory-students-repository'
import { Slug } from '../../enterprise/entities/value-object/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		inMemoryAttachmentRepository = new InMemoryAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryAttachmentRepository,
			inMemoryStudentsRepository,
		)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by its slug', async () => {
		const student = makeStudent({ name: 'John Doe' })

		inMemoryStudentsRepository.items.push(student)

		const newQuestion = makeQuestion({
			authorId: student.id,
			slug: Slug.create('example-question'),
		})

		await inMemoryQuestionsRepository.create(newQuestion)

		const attachment = makeAttachment({
			title: 'Attachment title',
		})

		inMemoryAttachmentRepository.items.push(attachment)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: attachment.id,
				questionId: newQuestion.id,
			}),
		)

		const result = await sut.execute({ slug: 'example-question' })

		expect(result.value).toMatchObject({
			question: expect.objectContaining({
				title: newQuestion.title,
				author: 'John Doe',
				attachments: [
					expect.objectContaining({
						title: 'Attachment title',
					}),
				],
			}),
		})
	})
})
