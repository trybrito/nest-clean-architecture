import type { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
	implements NotificationsRepository
{
	public items: Notification[] = []

	async findById(id: string) {
		const notification =
			this.items.find((item) => item.id.toString() === id) ?? null

		return notification
	}

	async create(notification: Notification) {
		this.items.push(notification)
	}

	async save(notification: Notification) {
		const notificationToBeUpdatedIndex = this.items.findIndex((item) => {
			item.id === notification.id
		})

		this.items[notificationToBeUpdatedIndex] = notification
	}
}
