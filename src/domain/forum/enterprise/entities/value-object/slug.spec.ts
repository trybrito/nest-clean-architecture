import { Slug } from './slug'

describe('Slug Value-object', () => {
	it('should create a slug based on a received text', () => {
		const slug = Slug.createFromText('An example question title')

		expect(slug.value).toEqual('an-example-question-title')
	})
})
