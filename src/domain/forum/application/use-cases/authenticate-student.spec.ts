import { FakeEncrypter } from 'tests/cryptography/fake-encrypter'
import { FakeHasher } from 'tests/cryptography/fake-hasher'
import { makeStudent } from 'tests/factories/forum/make-student'
import { InMemoryStudentsRepository } from 'tests/repositories/forum/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository()
		fakeHasher = new FakeHasher()
		fakeEncrypter = new FakeEncrypter()
		sut = new AuthenticateStudentUseCase(
			inMemoryStudentsRepository,
			fakeHasher,
			fakeEncrypter,
		)
	})

	it('should be able to authenticate a student', async () => {
		const student = makeStudent({
			email: 'doe@example.com',
			password: await fakeHasher.hash('123456'),
		})

		inMemoryStudentsRepository.items.push(student)

		const result = await sut.execute({
			email: 'doe@example.com',
			password: '123456',
		})

		expect(result.isRight()).toBe(true)
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		})
	})
})
