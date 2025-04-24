import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'tests/repositories/notification/in-memory-notifications-repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
	})

	it('should be able to send a notification', async () => {
		const result = await sut.execute({
			recipientId: '1',
			title: 'Test Notification',
			content: 'Some content',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items[0]).toEqual(
			result.value.notification,
		)
	})
})
