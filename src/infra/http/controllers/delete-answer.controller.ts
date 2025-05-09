import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from '@nestjs/common'
import { CurrentUser } from '../../auth/current-user-decorator'
import { TokenPayload } from '../../auth/jwt.strategy'

@Controller('/answers/:id')
export class DeleteAnswerController {
	constructor(private deleteAnswer: DeleteAnswerUseCase) {}

	@Delete()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: TokenPayload,
		@Param('id') answerId: string,
	) {
		const userId = user.sub

		const result = await this.deleteAnswer.execute({
			authorId: userId,
			answerId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
