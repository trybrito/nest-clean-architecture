import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details'
import { AttachmentPresenter } from './attachment-presenter'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class QuestionDetailsPresenter {
	static toHttp(questionDetails: QuestionDetails) {
		return {
			questionId: questionDetails.questionId.toString(),
			authorId: questionDetails.authorId.toString(),
			author: questionDetails.author,
			title: questionDetails.title,
			slug: questionDetails.slug.value,
			content: questionDetails.content,
			attachments: questionDetails.attachments.map(AttachmentPresenter.toHttp),
			bestAnswerId: questionDetails.bestAnswerId?.toString(),
			createdAt: questionDetails.createdAt,
			updatedAt: questionDetails.updatedAt,
		}
	}
}
