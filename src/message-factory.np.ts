// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, type NanoPackMessage } from "nanopack"

import { CreateWindow } from "./windowing/create-window.np.js"
import { InvokeCallback } from "./native-messages/invoke-callback.np.js"

function makeNanoPackMessage(
	bytes: Uint8Array,
): { bytesRead: number; result: NanoPackMessage } | null {
	const reader = new NanoBufReader(bytes)
	switch (reader.readTypeId()) {
		case 10:
			return CreateWindow.fromReader(reader)
		case 2:
			return InvokeCallback.fromReader(reader)
		default:
			return null
	}
}

export { makeNanoPackMessage }
