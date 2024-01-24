import { NanoBufReader } from "nanopack"

type CallbackHandle = number
type Callback = (argBytes: NanoBufReader) => void

class CallbackRegistry {
	private owners: Map<string, Set<CallbackHandle>> = new Map()
	private cbMap: Map<CallbackHandle, Callback> = new Map()

	constructor() {}

	public newCallback(cb: Callback, owner?: string): CallbackHandle {
		const handle = this.newCallbackHandle()

		this.cbMap.set(handle, cb)

		if (owner) {
			let owned = this.owners.get(owner)
			if (!owned) {
				owned = new Set()
				this.owners.set(owner, owned)
			}
			owned.add(handle)
		}

		return handle
	}

	public findCallback(handle: CallbackHandle): Callback | null {
		return this.cbMap.get(handle) ?? null
	}

	public invokeCallback(handle: CallbackHandle, argBytes: NanoBufReader) {
		const cb = this.cbMap.get(handle)
		if (cb) {
			cb(argBytes)
		}
	}

	public removeCallbacksOwnedBy(owner: string) {
		this.owners.get(owner)?.forEach((handle) => {
			this.cbMap.delete(handle)
		})
		this.owners.delete(owner)
	}

	private newCallbackHandle(): CallbackHandle {
		return Math.floor(Math.random() * 2 ** 32)
	}
}

export type { CallbackHandle, Callback }
export { CallbackRegistry }
