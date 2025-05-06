import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseRequest {
	page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questions: Question[]
	}
>

@Injectable()
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
