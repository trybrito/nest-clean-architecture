import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionUseCaseRequest {
	questionId: string
	authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	null
>

@Injectable()
export class DeleteQuestionUseCase {
	constructor(private questionsRepository: QuestionsRepository) {}

	async execute({
		questionId,
		authorId,
	}: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
		const question = await this.questionsRepository.findById(questionId)

		if (!question) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== question.authorId.toString()) {
			return left(new NotAllowedError())
		}

		await this.questionsRepository.delete(question)

		return right(null)
	}
}
