import { type Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-object/comment-with-author'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string
	page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[]
	}
>

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private commentsRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const comments =
			await this.commentsRepository.findManyByQuestionIdWithAuthor(questionId, {
				page,
			})

		return right({ comments })
	}
}
