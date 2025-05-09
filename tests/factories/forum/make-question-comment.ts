import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	QuestionComment,
	type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comments-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityId,
) {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	)

	return questionComment
}

@Injectable()
export class QuestionCommentFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaQuestionComment(
		data: Partial<QuestionCommentProps> = {},
	): Promise<QuestionComment> {
		const questionComment = makeQuestionComment(data)

		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPersistency(questionComment),
		})

		return questionComment
	}
}
