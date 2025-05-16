import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '../../auth/current-user-decorator'
import { TokenPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.string().uuid()),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
export class CreateQuestionController {
	constructor(private createQuestion: CreateQuestionUseCase) {}

	@Post()
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: CreateQuestionBodySchema,
	) {
		const userId = user.sub
		const { title, content, attachments } = body

		const result = await this.createQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds: attachments,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
