import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'
import { Injectable } from '@nestjs/common'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comments-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string) {
		const questionComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		})

		if (!questionComment) {
			return null
		}

		return PrismaQuestionCommentMapper.toDomain(questionComment)
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return questionComments.map(PrismaQuestionCommentMapper.toDomain)
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
			include: {
				author: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return questionComments.map(PrismaCommentWithAuthorMapper.toDomain)
	}

	async create(questionComment: QuestionComment) {
		const data = PrismaQuestionCommentMapper.toPersistency(questionComment)

		await this.prisma.comment.create({
			data,
		})
	}

	async delete(questionComment: QuestionComment) {
		const data = PrismaQuestionCommentMapper.toPersistency(questionComment)

		await this.prisma.comment.delete({
			where: {
				id: data.id,
			},
		})
	}
}
