import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswerComment } from '../../enterprise/entities/answer-comment'

export interface AnswerCommentsRepository {
	findById(answerCommentId: string): Promise<AnswerComment | null>
	findManyByAnswerId(
		answerId: string,
		param: PaginationParams,
	): Promise<AnswerComment[]>
	create(answerComment: AnswerComment): Promise<void>
	delete(answerComment: AnswerComment): Promise<void>
}
