import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AttachmentPresenter {
	static toHttp(attachment: Attachment) {
		return {
			id: attachment.id.toString(),
			title: attachment.title,
			url: attachment.url,
		}
	}
}
