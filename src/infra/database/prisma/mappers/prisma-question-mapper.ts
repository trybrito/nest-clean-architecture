import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'
import { Question as PrismaQuestion } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaQuestionMapper {
	static toDomain(raw: PrismaQuestion): Question {
		return Question.create(
			{
				title: raw.title,
				content: raw.content,
				authorId: new UniqueEntityId(raw.authorId),
				bestAnswerId: undefined,
				slug: Slug.create(raw.slug),
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new UniqueEntityId(raw.id),
		)
	}
}
