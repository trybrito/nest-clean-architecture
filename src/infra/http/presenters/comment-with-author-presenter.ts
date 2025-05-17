import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-object/comment-with-author'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CommentWithAuthorPresenter {
	static toHttp(commentWithAuthor: CommentWithAuthor) {
		return {
			commentId: commentWithAuthor.commentId.toString(),
			authorId: commentWithAuthor.authorId.toString(),
			authorName: commentWithAuthor.author,
			content: commentWithAuthor.content,
			createdAt: commentWithAuthor.createdAt,
			updatedAt: commentWithAuthor.updatedAt,
		}
	}
}
