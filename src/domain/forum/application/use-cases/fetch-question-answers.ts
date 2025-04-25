import { type Either, left, right } from '@/core/either'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import type { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { Answer } from '../../enterprise/entities/answer'
import type { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseRequest {
	questionId: string
	page: number
}

type FetchQuestionAnswersUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answers: Answer[]
	}
>

export class FetchQuestionAnswersUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answersRepository.findManyByQuestionId(
			questionId,
			{ page },
		)

		if (answers.length <= 0) {
			return left(new NotAllowedError())
		}

		return right({ answers })
	}
}
