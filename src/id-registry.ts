class IdRegistry {
	private ids = new Map<string, Set<number>>()

	public newId(type: string): number {
		const existingIds = this.ids.get(type)
		if (existingIds) {
			let id: number
			do {
				id = this.randomId()
			} while (existingIds.has(id))
			existingIds.add(id)
			return id
		}

		const id = this.randomId()
		const ids = new Set<number>()
		ids.add(id)
		this.ids.set(type, ids)
		return id
	}

	public forgetId(type: string, id: number) {
		const existingIds = this.ids.get(type)
		existingIds?.delete(id)
	}

	public isIdRegistered(id: number, type: string): boolean {
		return this.ids.get(type)?.has(id) ?? false
	}

	private randomId() {
		return Math.floor(Math.random() * 2147483648)
	}
}

export { IdRegistry }
