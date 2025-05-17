import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-object/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = []

	constructor(
		private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
		private attachmentsRepository: InMemoryAttachmentsRepository,
		private studentsRepository: InMemoryStudentsRepository,
	) {}

	async findById(id: string) {
		const question =
			this.items.find((item) => item.id.toString() === id) ?? null

		return question
	}

	async findBySlug(slug: string) {
		const question = this.items.find((item) => item.slug.value === slug) ?? null

		return question
	}

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const question = this.items.find((item) => item.slug.value === slug)

		if (!question) {
			return null
		}

		const author = this.studentsRepository.items.find((student) => {
			return student.id.equals(question.authorId)
		})

		if (!author) {
			throw new Error(
				`Author with ID ${question.authorId.toString()} does not exist`,
			)
		}

		const questionAttachments = this.questionAttachmentsRepository.items.filter(
			(questionAttachment) => questionAttachment.questionId.equals(question.id),
		)

		const attachments = questionAttachments.map((questionAttachment) => {
			const attachment = this.attachmentsRepository.items.find((attachment) => {
				return attachment.id.equals(questionAttachment.attachmentId)
			})

			if (!attachment) {
				throw new Error(
					`Author with ID ${questionAttachment.attachmentId.toString()} does not exist`,
				)
			}

			return attachment
		})

		return QuestionDetails.create({
			questionId: question.id,
			authorId: question.authorId,
			author: author.name,
			title: question.title,
			slug: question.slug.value,
			content: question.content,
			bestAnswerId: question.bestAnswerId,
			attachments,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		})
	}

	async findManyRecent({ page }: PaginationParams) {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20)

		return questions
	}

	async create(question: Question) {
		this.items.push(question)

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		)

		DomainEvents.dispatchEventsForAggregate(question.id)
	}

	async save(question: Question): Promise<void> {
		const questionToBeUpdatedIndex = this.items.findIndex(
			(item) => item.id === question.id,
		)

		this.items[questionToBeUpdatedIndex] = question

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getNewItems(),
		)

		await this.questionAttachmentsRepository.deleteMany(
			question.attachments.getRemovedItems(),
		)

		DomainEvents.dispatchEventsForAggregate(question.id)
	}

	async delete(question: Question) {
		const questionToBeDeletedIndex = this.items.findIndex(
			(item) => item.id === question.id,
		)

		this.items.splice(questionToBeDeletedIndex, 1)
		this.questionAttachmentsRepository?.deleteManyByQuestionId(
			question.id.toString(),
		)
	}
}
