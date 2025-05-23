import { type Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/custom/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/custom/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import type { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

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

@Injectable()
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
