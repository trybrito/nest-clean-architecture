import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@prisma/client'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class PrismaAttachmentMapper {
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
