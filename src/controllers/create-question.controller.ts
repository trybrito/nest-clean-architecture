import { Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TokenPayload } from 'src/auth/jwt.strategy'
import { PrismaService } from 'src/prisma/prisma.service'

// const createQuestionBodySchema = z.object({
// 	title: z.string(),
// 	content: z.string(),
// })

// type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
	constructor(private prisma: PrismaService) {}

	@Post()
	// @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
	async handle(@CurrentUser() user: TokenPayload) {
		console.log(user)
	}
}
