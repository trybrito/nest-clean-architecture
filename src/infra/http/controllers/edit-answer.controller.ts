import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
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

const editAnswerBodySchema = z.object({
	content: z.string(),
	attachments: z.array(z.string().uuid()),
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

@Controller('/answers/:id')
export class EditAnswerController {
	constructor(private editAnswer: EditAnswerUseCase) {}

	@Put()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: TokenPayload,
		@Body(bodyValidationPipe) body: EditAnswerBodySchema,
		@Param('id') answerId: string,
	) {
		const userId = user.sub
		const { content, attachments } = body

		const result = await this.editAnswer.execute({
			content,
			answerId,
			authorId: userId,
			attachmentsIds: attachments,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
