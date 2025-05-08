import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Attachment as PrismaAttachment } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaAnswerAttachmentMapper {
	static toDomain(raw: PrismaAttachment): AnswerAttachment {
		if (!raw.questionId) {
			throw new Error('Invalid attachment type')
		}

		return AnswerAttachment.create(
			{
				attachmentId: new UniqueEntityId(raw.id),
				answerId: new UniqueEntityId(raw.questionId),
			},
			new UniqueEntityId(raw.id),
		)
	}
}
