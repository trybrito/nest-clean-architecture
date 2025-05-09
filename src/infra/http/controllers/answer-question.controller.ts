import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
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

const answerQuestionBodySchema = z.object({
	content: z.string(),
})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema)

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
	constructor(private answerQuestion: AnswerQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@Param('questionId') questionId: string,
	) {
		const userId = user.sub
		const { content } = body

		const result = await this.answerQuestion.execute({
			authorId: userId,
			questionId,
			content,
			attachmentsIds: [],
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
