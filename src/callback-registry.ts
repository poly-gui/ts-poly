import type { NanoPackMessage } from "nanopack"

type CallbackHandle = number
type Callback = (arg: NanoPackMessage) => NanoPackMessage | null
type VoidCallback = (arg: NanoPackMessage) => void

class CallbackRegistry {
	private cbMap: Map<CallbackHandle, Callback | VoidCallback> = new Map()
	private cbHandleMap: Map<Callback, CallbackHandle> = new Map()

	public newCallback(cb: Callback): CallbackHandle {
		const handle = this.newCallbackHandle()
		this.cbMap.set(handle, cb)
		return handle
	}

	public newVoidCallback(cb: VoidCallback): CallbackHandle {
		const handle = this.newCallbackHandle()
		this.cbMap.set(handle, cb)
		return handle
	}

	public findCallback(handle: CallbackHandle): Callback | VoidCallback | null {
		return this.cbMap.get(handle) ?? null
	}

	public callbackHandleOf(callback: Callback): CallbackHandle | null {
		return this.cbHandleMap.get(callback) ?? null
	}

	public invokeCallback(
		handle: CallbackHandle,
		args: NanoPackMessage,
	): NanoPackMessage | null {
		const cb = this.cbMap.get(handle)
		if (cb) {
			return cb(args) ?? null
		}
		return null
	}

	public invokeVoidCallback(handle: CallbackHandle, args: NanoPackMessage) {
		this.cbMap.get(handle)?.(args)
	}

	private newCallbackHandle(): CallbackHandle {
		return Math.floor(Math.random() * 4294967295)
	}
}

export type { CallbackHandle, Callback }
export { CallbackRegistry }
