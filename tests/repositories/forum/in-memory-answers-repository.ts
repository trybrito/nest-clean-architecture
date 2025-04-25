import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import type { Answer } from '@/domain/forum/enterprise/entities/answer'
import type { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = []

	constructor(
		private inMemoryAnswerAttachmentsRepository?: InMemoryAnswerAttachmentsRepository,
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

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async save(answer: Answer) {
		const answerToBeUpdatedIndex = this.items.findIndex(
			(item) => item.id === answer.id,
		)

		this.items[answerToBeUpdatedIndex] = answer

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async delete(answer: Answer) {
		const answerToBeDeletedIndex = this.items.findIndex(
			(item) => item.id === answer.id,
		)

		this.items.splice(answerToBeDeletedIndex, 1)
		this.inMemoryAnswerAttachmentsRepository?.deleteManyByAnswerId(
			answer.id.toString(),
		)
	}
}
