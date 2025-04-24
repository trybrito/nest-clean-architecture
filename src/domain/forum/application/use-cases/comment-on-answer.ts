import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { AnswersRepository } from '../repositories/answers-repository'
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { left, right, type Either } from '@/core/either'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'

interface CommentOnAnswerUseCaseRequest {
	authorId: string
	answerId: string
	content: string
}

type CommentOnAnswerUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		answerComment: AnswerComment
	}
>

export class CommentOnAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerCommentsRepository: AnswerCommentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
	}: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		const answerComment = AnswerComment.create({
			authorId: new UniqueEntityId(authorId),
			answerId: new UniqueEntityId(answerId),
			content,
		})

		await this.answerCommentsRepository.create(answerComment)

		return right({ answerComment })
	}
}
