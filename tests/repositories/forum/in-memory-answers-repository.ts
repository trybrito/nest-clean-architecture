import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = []

	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async findById(answerId: string) {
		const answer =
			this.items.find((item) => item.id.toString() === answerId) ?? null

		return answer
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20)

		return answers
	}

	async create(answer: Answer) {
		this.items.push(answer)

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems(),
		)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async save(answer: Answer) {
		const answerToBeUpdatedIndex = this.items.findIndex(
			(item) => item.id === answer.id,
		)

		this.items[answerToBeUpdatedIndex] = answer

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getNewItems(),
		)

		await this.answerAttachmentsRepository.deleteMany(
			answer.attachments.getRemovedItems(),
		)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async delete(answer: Answer) {
		const answerToBeDeletedIndex = this.items.findIndex(
			(item) => item.id === answer.id,
		)

		this.items.splice(answerToBeDeletedIndex, 1)
		this.answerAttachmentsRepository?.deleteManyByAnswerId(answer.id.toString())
	}
}
