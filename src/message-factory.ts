import type { NanoPackMessage } from "nanopack"

import { InvokeCallback } from "./native-messages/invoke-callback.np.js"
import { CreateWindow } from "./windowing/create-window.np.js"

function makeNanoPackMessage(
	bytes: Uint8Array,
	typeId: number,
): { bytesRead: number; result: NanoPackMessage } | null {
	switch (typeId) {
		case 2:
			return InvokeCallback.fromBytes(bytes)
		case 10:
			return CreateWindow.fromBytes(bytes)
		default:
			return null
	}
}

export { makeNanoPackMessage }
