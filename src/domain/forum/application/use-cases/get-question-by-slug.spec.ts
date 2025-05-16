import { makeQuestion } from 'tests/factories/forum/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'tests/repositories/forum/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { Slug } from '../../enterprise/entities/value-object/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by its slug', async () => {
		const newQuestion = makeQuestion({
			slug: Slug.create('example-content'),
		})
		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({ slug: 'example-content' })

		expect(result.isRight()).toBe(true)
		if (result.isRight()) {
			expect(result.value.question.id).toEqual(newQuestion.id)
		}
	})
})
