export abstract class ValueObject<Props> {
	protected props: Props

	protected constructor(props: Props) {
		this.props = props
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public equals(valueObject: ValueObject<any>) {
		if (valueObject === null || valueObject === undefined) {
			return false
		}

		if (valueObject.props === undefined) {
			return false
		}

		return JSON.stringify(valueObject.props) === JSON.stringify(this.props)
	}
}
