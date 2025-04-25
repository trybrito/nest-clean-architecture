import { makeAnswer } from 'tests/factories/forum/make-answer'
import { makeQuestion } from 'tests/factories/forum/make-question'
import { InMemoryAnswersRepository } from 'tests/repositories/forum/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'tests/repositories/forum/in-memory-questions-repository'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		sut = new ChooseQuestionBestAnswerUseCase(
			inMemoryQuestionsRepository,
			inMemoryAnswersRepository,
		)
	})

	it('should be able to choose the best answer', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({
			questionId: question.id,
		})

		await inMemoryQuestionsRepository.create(question)
		await inMemoryAnswersRepository.create(answer)

		await sut.execute({
			answerId: answer.id.toString(),
			authorId: question.authorId.toString(),
		})

		expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
	})

	it('should not allow that other users to choose the best answer', async () => {
		const question = makeQuestion()
		const answer = makeAnswer({
			questionId: question.id,
		})

		await inMemoryQuestionsRepository.create(question)
		await inMemoryAnswersRepository.create(answer)

		const result = await sut.execute({
			answerId: answer.id.toString(),
			authorId: 'other-author',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
