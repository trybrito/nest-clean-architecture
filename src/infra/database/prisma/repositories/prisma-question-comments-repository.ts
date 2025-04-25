import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async findById(questionCommentId: string): Promise<QuestionComment | null> {
		throw new Error('Method not implemented.')
	}

	async findManyByQuestionId(
		questionId: string,
		param: PaginationParams,
	): Promise<QuestionComment[]> {
		throw new Error('Method not implemented.')
	}

	async create(questionComment: QuestionComment): Promise<void> {
		throw new Error('Method not implemented.')
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		throw new Error('Method not implemented.')
	}
}
