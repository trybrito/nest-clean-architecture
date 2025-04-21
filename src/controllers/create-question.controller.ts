import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
	title: z.string(),
	content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
	async handle(@Body() body: CreateQuestionBodySchema) {
		const { title, content } = body
	}
}
