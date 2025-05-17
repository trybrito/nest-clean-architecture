import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaAttachmentMapper {
	static toDomain(raw: PrismaAttachment): Attachment {
		return Attachment.create(
			{
				title: raw.title,
				url: raw.url,
			},
			new UniqueEntityId(raw.id),
		)
	}

	static toPersistency(
		attachment: Attachment,
	): Prisma.AttachmentUncheckedCreateInput {
		return {
			id: attachment.id.toString(),
			title: attachment.title,
			url: attachment.url,
		}
	}
}
