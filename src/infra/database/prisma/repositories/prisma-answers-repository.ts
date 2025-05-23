import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async findById(id: string) {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		})

		if (!answer) {
			return null
		}

		return PrismaAnswerMapper.toDomain(answer)
	}

	async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 20,
			skip: (page - 1) * 20,
		})

		return answers.map(PrismaAnswerMapper.toDomain)
	}

	async create(answer: Answer) {
		const data = PrismaAnswerMapper.toPersistency(answer)

		await this.prisma.answer.create({
			data,
		})

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems(),
		)

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async save(answer: Answer) {
		const data = PrismaAnswerMapper.toPersistency(answer)

		await Promise.all([
			this.prisma.answer.update({
				where: {
					id: data.id,
				},
				data,
			}),
			this.answerAttachmentsRepository.createMany(
				answer.attachments.getNewItems(),
			),
			await this.answerAttachmentsRepository.deleteMany(
				answer.attachments.getRemovedItems(),
			),
		])

		DomainEvents.dispatchEventsForAggregate(answer.id)
	}

	async delete(answer: Answer) {
		const data = PrismaAnswerMapper.toPersistency(answer) // non exactly necessary, but improves readability

		await this.prisma.answer.delete({
			where: {
				id: data.id,
			},
		})
	}
}
