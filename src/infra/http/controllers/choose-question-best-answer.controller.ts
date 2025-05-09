import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	Patch,
} from '@nestjs/common'
import { CurrentUser } from '../../auth/current-user-decorator'
import { TokenPayload } from '../../auth/jwt.strategy'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseQuestionBestAnswerController {
	constructor(
		private chooseQuestionBestAnswer: ChooseQuestionBestAnswerUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	async handle(
		@CurrentUser() user: TokenPayload,
		@Param('answerId') answerId: string,
	) {
		const userId = user.sub

		const result = await this.chooseQuestionBestAnswer.execute({
			authorId: userId,
			answerId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}
	}
}
