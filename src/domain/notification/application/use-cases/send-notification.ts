import { right, type Either } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import type { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseRequest {
	recipientId: string
	title: string
	content: string
}

export type SendNotificationUseCaseResponse = Either<
	never,
	{
		notification: Notification
	}
>

export class SendNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		title,
		content,
	}: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
		const notification = Notification.create({
			recipientId: new UniqueEntityId(recipientId),
			title,
			content,
		})

		await this.notificationsRepository.create(notification)

		return right({ notification })
	}
}
