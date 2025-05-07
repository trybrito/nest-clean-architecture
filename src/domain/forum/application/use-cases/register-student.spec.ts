import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'tests/repositories/forum/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

describe('Register Student', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		fakeHasher = new FakeHasher()
		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
	})

	it('should be able to register a new student', async () => {
		const result = await sut.execute({
			name: 'John Doe',
			email: 'doe@example.com',
			password: '123456',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			student: inMemoryStudentsRepository.items[0],
		})
	})

	it('should hash student password on registration', async () => {
		const password = '123456'

		const result = await sut.execute({
			name: 'John Doe',
			email: 'doe@example.com',
			password,
		})

		const hashedPassword = await fakeHasher.hash(password)

		expect(result.isRight()).toBe(true)
		expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
	})
})
