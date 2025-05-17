import { type Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { NotAllowedError } from '../../../../core/errors/custom/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/custom/resource-not-found-error'
import type { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseRequest {
	answerId: string
	authorId: string
	content: string
	attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		answer: Answer
	}
>

@Injectable()
export class EditAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async execute({
		answerId,
		authorId,
		content,
		attachmentsIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new NotAllowedError())
		}

		const currentAnswerAttachments =
			await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

		const answerAttachmentsList = new AnswerAttachmentList(
			currentAnswerAttachments,
		)

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			})
		})

		answerAttachmentsList.update(answerAttachments)

		answer.content = content
		answer.attachments = answerAttachmentsList

		await this.answersRepository.save(answer)

		return right({ answer })
	}
}
