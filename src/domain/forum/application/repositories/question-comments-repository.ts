import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionComment } from '../../enterprise/entities/question-comment'

export abstract class QuestionCommentsRepository {
	abstract findById(questionCommentId: string): Promise<QuestionComment | null>
	abstract findManyByQuestionId(
		questionId: string,
		param: PaginationParams,
	): Promise<QuestionComment[]>
	abstract create(questionComment: QuestionComment): Promise<void>
	abstract delete(questionComment: QuestionComment): Promise<void>
}
