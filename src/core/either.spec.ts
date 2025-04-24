import { left, right, type Either } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string> {
	if (shouldSuccess) {
		return right('Success')
	}

	return left('Error')
}

describe('Either Error or Success', () => {
	it('should return a success result', () => {
		const result = doSomething(true)

		expect(result.isRight()).toBe(true)
		expect(result.isLeft()).toBe(false)
		expect(result.value).toBe('Success')
	})

	it('should return an error result', () => {
		const result = doSomething(false)

		expect(result.isRight()).toBe(false)
		expect(result.isLeft()).toBe(true)
		expect(result.value).toBe('Error')
	})
})
