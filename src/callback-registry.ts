type CallbackHandle = number
type Callback<T extends Array<unknown> = unknown[]> = (...args: T) => unknown

class CallbackRegistry {
	private cbMap: Map<CallbackHandle, Callback> = new Map()

	constructor() {}

	public newCallback(cb: Callback): CallbackHandle {
		const handle = this.newCallbackHandle()
		this.cbMap.set(handle, cb)
		return handle
	}

	public findCallback(handle: CallbackHandle): Callback | null {
		return this.cbMap.get(handle) ?? null
	}

	private newCallbackHandle(): CallbackHandle {
		return Math.floor(Math.random() * 2 ** 32)
	}
}

export type { CallbackHandle, Callback }
export { CallbackRegistry }
