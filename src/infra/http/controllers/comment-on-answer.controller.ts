import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
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

const commentOnAnswerBodySchema = z.object({
	content: z.string(),
})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
	constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
		@Param('answerId') answerId: string,
	) {
		const userId = user.sub
		const { content } = body

		const result = await this.commentOnAnswer.execute({
			authorId: userId,
			answerId,
			content,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
