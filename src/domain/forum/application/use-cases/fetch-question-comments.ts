import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

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

@Injectable()
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
