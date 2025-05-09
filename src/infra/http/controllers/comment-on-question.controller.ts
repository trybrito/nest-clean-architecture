import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '../../auth/current-user-decorator'
import { TokenPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnQuestionBodySchema = z.object({
	content: z.string(),
})

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema)

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
	constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
		@Param('questionId') questionId: string,
	) {
		const userId = user.sub
		const { content } = body

		const result = await this.commentOnQuestion.execute({
			authorId: userId,
			questionId,
			content,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
