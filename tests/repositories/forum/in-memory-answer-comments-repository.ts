import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	public items: AnswerComment[] = []

	async findById(answerCommentId: string) {
		const answerComment =
			this.items.find((item) => item.id.toString() === answerCommentId) ?? null

		return answerComment
	}

	async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20)

		return answerComments
	}

	async create(answerComment: AnswerComment) {
		this.items.push(answerComment)
	}

	async delete(answerComment: AnswerComment) {
		const answerCommentToBeDeletedIndex = this.items.findIndex(
			(item) => item.id === answerComment.id,
		)

		this.items.splice(answerCommentToBeDeletedIndex, 1)
	}
}
