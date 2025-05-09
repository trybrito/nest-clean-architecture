import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
	abstract findById(answerCommentId: string): Promise<AnswerComment | null>
	abstract findManyByAnswerId(
		answerId: string,
		param: PaginationParams,
	): Promise<AnswerComment[]>
	abstract create(answerComment: AnswerComment): Promise<void>
	abstract delete(answerComment: AnswerComment): Promise<void>
}
