import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async findById(answerCommentId: string): Promise<AnswerComment | null> {
		throw new Error('Method not implemented.')
	}

	async findManyByAnswerId(
		answerId: string,
		param: PaginationParams,
	): Promise<AnswerComment[]> {
		throw new Error('Method not implemented.')
	}

	async create(answerComment: AnswerComment): Promise<void> {
		throw new Error('Method not implemented.')
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		throw new Error('Method not implemented.')
	}
}
