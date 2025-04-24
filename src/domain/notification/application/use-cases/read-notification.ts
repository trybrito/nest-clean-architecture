import { type Either, left, right } from '@/core/either'
import type { Notification } from '../../enterprise/entities/notification'
import type { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from '@/core/errors/custom/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/custom/not-allowed-error'

interface ReadNotificationUseCaseRequest {
	recipientId: string
	notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		notification: Notification
	}
>

export class ReadNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		notificationId,
	}: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
		const notification =
			await this.notificationsRepository.findById(notificationId)

		if (!notification) {
			return left(new ResourceNotFoundError())
		}

		if (notification.recipientId.toString() !== recipientId) {
			return left(new NotAllowedError())
		}

		notification.read()

		await this.notificationsRepository.save(notification)

		return right({ notification })
	}
}
