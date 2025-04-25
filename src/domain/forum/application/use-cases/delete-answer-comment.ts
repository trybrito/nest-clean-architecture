import { type Either, left, right } from '@/core/either'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface DeleteAnswerCommentUseCaseRequest {
	authorId: string
	answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>

export class DeleteAnswerCommentUseCase {
	constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

	async execute({
		authorId,
		answerCommentId,
	}: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
		const answerComment =
			await this.answerCommentsRepository.findById(answerCommentId)

		if (!answerComment) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== answerComment.authorId.toString()) {
			return left(new NotAllowedError())
		}

		await this.answerCommentsRepository.delete(answerComment)

		return right(null)
	}
}
