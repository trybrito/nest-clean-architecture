import { left, right, type Either } from '@/core/either'
import type { QuestionComment } from '../../enterprise/entities/question-comment'
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'

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
