import { makeNotification } from 'tests/factories/notification/make-notification'
import { ReadNotificationUseCase } from './read-notification'
import { InMemoryNotificationsRepository } from 'tests/repositories/notification/in-memory-notifications-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/custom/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
	})

	it('should be able to mark a notification as read', async () => {
		const notification = makeNotification()

		await inMemoryNotificationsRepository.create(notification)

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: notification.recipientId.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
			expect.any(Date),
		)
	})

	it('should be able to mark a notification as read', async () => {
		const notification = makeNotification()

		await inMemoryNotificationsRepository.create(notification)

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: notification.recipientId.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
			expect.any(Date),
		)
	})

	it('should not be able to mark another user notification as read', async () => {
		const notification = makeNotification({
			recipientId: new UniqueEntityId('author-1'),
		})

		await inMemoryNotificationsRepository.create(notification)

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: 'another-author-1',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
