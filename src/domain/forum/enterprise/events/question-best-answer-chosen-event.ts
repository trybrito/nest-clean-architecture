import type { DomainEvent } from '@/core/events/domain-event'
import type { Question } from '../entities/question'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
	public occurredAt: Date
	public question: Question
	public bestAnswerId: UniqueEntityId

	constructor(question: Question, bestAnswerId: UniqueEntityId) {
		this.question = question
		this.bestAnswerId = bestAnswerId
		this.occurredAt = new Date()
	}

	getAggregateId(): UniqueEntityId {
		return this.question.id
	}
}
