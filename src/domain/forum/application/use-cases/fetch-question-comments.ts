import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { QuestionComment } from '../../enterprise/entities/question-comment'
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string
	page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		questionComments: QuestionComment[]
	}
>

export class FetchQuestionCommentsUseCase {
	constructor(private commentsRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const questionComments = await this.commentsRepository.findManyByQuestionId(
			questionId,
			{ page },
		)

		if (questionComments.length <= 0) {
			return left(new ResourceNotFoundError())
		}

		return right({ questionComments })
	}
}
