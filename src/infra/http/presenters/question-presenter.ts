import { Question } from '@/domain/forum/enterprise/entities/question'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class QuestionPresenter {
	static toHttp(question: Question) {
		return {
			id: question.id.toString(),
			title: question.title,
			slug: question.slug.value,
			bestAnswerId: question.bestAnswerId?.toString(),
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		}
	}
}
