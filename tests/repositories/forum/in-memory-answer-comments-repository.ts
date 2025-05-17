import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	public items: AnswerComment[] = []

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

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

	async findManyByAnswerIdWithAuthor(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20)
			.map((comment) => {
				const author = this.studentsRepository.items.find((student) => {
					return student.id.equals(comment.authorId)
				})

				if (!author) {
					throw new Error(
						`Author with ID ${comment.authorId.toString()} does not exist!`,
					)
				}

				return CommentWithAuthor.create({
					commentId: comment.id,
					content: comment.content,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
					authorId: comment.authorId,
					author: author.name,
				})
			})

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
