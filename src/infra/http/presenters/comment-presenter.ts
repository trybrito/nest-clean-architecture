import { Comment } from '@/domain/forum/enterprise/entities/comment'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CommentPresenter {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	static toHttp(comment: Comment<any>) {
		return {
			id: comment.id.toString(),
			content: comment.content,
			createdAt: comment.createdAt,
			updatedAt: comment.updatedAt,
		}
	}
}
