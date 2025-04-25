import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import type { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
	constructor(
		private answersRepository: AnswersRepository,
		private sendNotification: SendNotificationUseCase,
	) {
		this.setupSubscriptions()
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendNewQuestionBestAnswerChosenNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		)
	}

	private async sendNewQuestionBestAnswerChosenNotification({
		question,
		bestAnswerId,
	}: QuestionBestAnswerChosenEvent) {
		const answer = await this.answersRepository.findById(
			bestAnswerId.toString(),
		)

		if (answer) {
			await this.sendNotification.execute({
				recipientId: answer.authorId.toString(),
				title: 'Sua resposta foi escolhida como a melhor!',
				content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor como sendo a melhor resposta, parabéns!`,
			})
		}
	}
}
