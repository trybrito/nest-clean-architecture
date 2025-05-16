import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	Param,
	Put,
} from '@nestjs/common'
import { z } from 'zod'
import { CurrentUser } from '../../auth/current-user-decorator'
import { TokenPayload } from '../../auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
	attachments: z.array(z.string().uuid()),
})

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

@Controller('/questions/:id')
export class EditQuestionController {
	constructor(private editQuestion: EditQuestionUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: EditQuestionBodySchema,
		@Param('id') questionId: string,
	) {
		const userId = user.sub
		const { title, content, attachments } = body

		const result = await this.editQuestion.execute({
			title,
			content,
			authorId: userId,
			attachmentsIds: attachments,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
