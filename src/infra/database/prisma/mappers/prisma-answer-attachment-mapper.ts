import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaAnswerAttachmentMapper {
	static toDomain(raw: PrismaAttachment): AnswerAttachment {
		if (!raw.answerId) {
			throw new Error('Invalid attachment type')
		}

		return AnswerAttachment.create(
			{
				attachmentId: new UniqueEntityId(raw.id),
				answerId: new UniqueEntityId(raw.answerId),
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPrismaUpdateMany(
		attachments: AnswerAttachment[],
	): Prisma.AttachmentUpdateManyArgs {
		const attachmentIds = attachments.map((attachment) =>
			attachment.attachmentId.toString(),
		)

		return {
			where: {
				id: {
					in: attachmentIds,
				},
			},
			data: {
				answerId: attachments[0].answerId.toString(),
			},
		}
	}
}
