import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const pageQueryParamSchema = z
	.string()
	.optional()
	.default('1')
	.transform(Number)
	.pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
	constructor(private fetchRecentQuestion: FetchAnswerCommentsUseCase) {}

	@Get()
	async handle(
		@Query('page', queryValidationPipe) page: PageQueryParamSchema,
		@Param('answerId') answerId: string,
	) {
		const result = await this.fetchRecentQuestion.execute({
			page,
			answerId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const comments = result.value.comments

		return { comments: comments.map(CommentWithAuthorPresenter.toHttp) }
	}
}
