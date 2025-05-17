import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAuthor } from '../../enterprise/entities/value-object/comment-with-author'

export abstract class AnswerCommentsRepository {
	abstract findById(answerCommentId: string): Promise<AnswerComment | null>

	abstract findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]>
	abstract findManyByAnswerIdWithAuthor(
		answerId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]>

	abstract create(answerComment: AnswerComment): Promise<void>
	abstract delete(answerComment: AnswerComment): Promise<void>
}
