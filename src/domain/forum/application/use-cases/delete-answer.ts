import { left, right, type Either } from '@/core/either'
import type { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
	answerId: string
	authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>

export class DeleteAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		answerId,
		authorId,
	}: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError())
		}

		await this.answersRepository.delete(answer)

		return right(null)
	}
}
