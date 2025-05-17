import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
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

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
	constructor(private fetchRecentQuestion: FetchQuestionCommentsUseCase) {}

	@Get()
	async handle(
		@Query('page', queryValidationPipe) page: PageQueryParamSchema,
		@Param('questionId') questionId: string,
	) {
		const result = await this.fetchRecentQuestion.execute({
			page,
			questionId,
		})

		if (result.isLeft()) {
			throw new BadRequestException()
		}

		const comments = result.value.comments

		return { comments: comments.map(CommentWithAuthorPresenter.toHttp) }
	}
}
