import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Prisma, Comment as PrismaComment } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaQuestionCommentMapper {
	static toDomain(raw: PrismaComment): QuestionComment {
		if (!raw.questionId) {
			throw new Error('Invalid comment type')
		}

		return QuestionComment.create(
			{
				authorId: new UniqueEntityId(raw.authorId),
				questionId: new UniqueEntityId(raw.questionId),
				content: raw.content,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPersistency(
		questionComment: QuestionComment,
	): Prisma.CommentUncheckedCreateInput {
		return {
			id: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
			questionId: questionComment.questionId.toString(),
			content: questionComment.content,
			createdAt: questionComment.createdAt,
			updatedAt: questionComment.updatedAt,
		}
	}
}
