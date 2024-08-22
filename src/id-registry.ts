class IdRegistry {
	private ids = new Set<number>()

	public newId(): number {
		let id: number
		do {
			id = this.randomId()
		} while (this.ids.has(id))
		return id
	}

	public forgetId(id: number) {
		this.ids.delete(id)
	}

	public isIdRegistered(id: number): boolean {
		return this.ids.has(id)
	}

	private randomId() {
		return Math.floor(Math.random() * 2147483648)
	}
}

export { IdRegistry }
