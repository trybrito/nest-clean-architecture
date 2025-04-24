import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	public items: QuestionComment[] = []

	async findById(questionCommentId: string) {
		const questionComment =
			this.items.find((item) => item.id.toString() === questionCommentId) ??
			null

		return questionComment
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)

		return questionComments
	}

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment)
	}

	async delete(questionComment: QuestionComment) {
		const questionCommentToBeDeletedIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		)

		this.items.splice(questionCommentToBeDeletedIndex, 1)
	}
}
