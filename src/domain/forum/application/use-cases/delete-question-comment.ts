import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface DeleteQuestionCommentUseCaseRequest {
	authorId: string
	questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>

@Injectable()
export class DeleteQuestionCommentUseCase {
	constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

	async execute({
		authorId,
		questionCommentId,
	}: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
		const questionComment =
			await this.questionCommentsRepository.findById(questionCommentId)

		if (!questionComment) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== questionComment.authorId.toString()) {
			return left(new NotAllowedError())
		}

		await this.questionCommentsRepository.delete(questionComment)

		return right(null)
	}
}
