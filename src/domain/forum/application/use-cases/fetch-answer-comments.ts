import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string
	page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answerComments: AnswerComment[]
	}
>

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private commentsRepository: AnswerCommentsRepository) {}

	async execute({
		answerId,
		page,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const answerComments = await this.commentsRepository.findManyByAnswerId(
			answerId,
			{ page },
		)

		if (answerComments.length <= 0) {
			return left(new ResourceNotFoundError())
		}

		return right({ answerComments })
	}
}
