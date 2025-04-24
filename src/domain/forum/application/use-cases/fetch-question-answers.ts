import { left, right, type Either } from '@/core/either'
import type { Answer } from '../../enterprise/entities/answer'
import type { AnswersRepository } from '../repositories/answers-repository'
import type { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'

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
