import { type Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-object/comment-with-author'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
	answerId: string
	page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[]
	}
>

@Injectable()
export class FetchAnswerCommentsUseCase {
	constructor(private commentsRepository: AnswerCommentsRepository) {}

	async execute({
		answerId,
		page,
	}: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
		const comments = await this.commentsRepository.findManyByAnswerIdWithAuthor(
			answerId,
			{ page },
		)

		return right({ comments })
	}
}
