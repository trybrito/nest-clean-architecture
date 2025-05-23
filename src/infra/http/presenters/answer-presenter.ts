import { Answer } from '@/domain/forum/enterprise/entities/answer'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class AnswerPresenter {
	static toHttp(answer: Answer) {
		return {
			id: answer.id.toString(),
			content: answer.content,
			createdAt: answer.createdAt,
			updatedAt: answer.updatedAt,
		}
	}
}
