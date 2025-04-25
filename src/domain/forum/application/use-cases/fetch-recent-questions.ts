import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { Question } from '../../enterprise/entities/question'
import type { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseRequest {
	page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questions: Question[]
	}
>

export class FetchRecentQuestionsUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		page,
	}: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
		const questions = await this.questionsRepository.findManyRecent({ page })

		if (questions.length <= 0) {
			return left(new ResourceNotFoundError())
		}

		return right({ questions })
	}
}
