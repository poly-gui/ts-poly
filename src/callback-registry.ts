import type { NanoBufReader, NanoPackMessage } from "nanopack"

type CallbackHandle = number
type Callback = (argBytes: NanoBufReader) => NanoPackMessage | null | void

class CallbackRegistry {
	static KEY = "Poly.CallbackRegistry"

	private owners: Map<string, Set<CallbackHandle>> = new Map()
	private cbMap: Map<CallbackHandle, Callback> = new Map()
	private cbHandleMap: Map<Callback, CallbackHandle> = new Map()

	constructor() {}

	public newCallback(cb: Callback, owner?: string): CallbackHandle {
		const handle = this.newCallbackHandle()

		this.cbMap.set(handle, cb)
		this.cbHandleMap.set(cb, handle)

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

	public callbackHandleOf(callback: Callback): CallbackHandle | null {
		return this.cbHandleMap.get(callback) ?? null
	}

	public invokeCallback(handle: CallbackHandle, argBytes: NanoBufReader): NanoPackMessage | null | void {
		const cb = this.cbMap.get(handle)
		if (cb) {
			return cb(argBytes)
		}
		return null
	}

	public removeCallbacksOwnedBy(owner: string) {
		this.owners.get(owner)?.forEach((handle) => {
			this.cbMap.delete(handle)
		})
		this.owners.delete(owner)
	}

	private newCallbackHandle(): CallbackHandle {
		return Math.floor(Math.random() * 2147483648)
	}
}

export type { CallbackHandle, Callback }
export { CallbackRegistry }
