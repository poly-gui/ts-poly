// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, type NanoPackMessage } from "nanopack"

import { ReplyFromCallback } from "./messages/reply-from-callback.np.js"
import { Request } from "./messages/request.np.js"
import { OkResponse } from "./messages/ok-response.np.js"
import { InvokeCallback } from "./messages/invoke-callback.np.js"
import { CreateWindow } from "./windowing/create-window.np.js"

function makeNanoPackMessage(
	bytes: Uint8Array,
): { bytesRead: number; result: NanoPackMessage } | null {
	const reader = new NanoBufReader(bytes)
	switch (reader.readTypeId()) {
		case 370365707:
			return ReplyFromCallback.fromReader(reader)
		case 879254966:
			return Request.fromReader(reader)
		case 1144955386:
			return OkResponse.fromReader(reader)
		case 2013877267:
			return InvokeCallback.fromReader(reader)
		case 3533765426:
			return CreateWindow.fromReader(reader)
		default:
			return null
	}
}

export { makeNanoPackMessage }
