import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common'
import { CurrentUser } from '../../auth/current-user-decorator'
import { TokenPayload } from '../../auth/jwt.strategy'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
	constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: TokenPayload,
		@Param('id') questionCommentId: string,
	) {
		const userId = user.sub

		const result = await this.deleteQuestionComment.execute({
			authorId: userId,
			questionCommentId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
