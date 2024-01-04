import { MessageChannel } from "./message-channel.js"
import { NanoPackMessage } from "nanopack"
import { readInt32LEInByteArray } from "../util/byte-util.js"

interface StdIo {
	stdin(): AsyncGenerator<Uint8Array>

	stdout(data: Uint8Array): Promise<void>
}

class StdioMessageChannel implements MessageChannel {
	constructor(private stdio: StdIo) {}

	async *incomingMessageBytes(): AsyncGenerator<Uint8Array> {
		let buffer: Uint8Array | null = null
		let remainingBytes = 0
		for await (const chunk of this.stdio.stdin()) {
			const chunkSize = chunk.byteLength
			let msgStart = 0

			if (remainingBytes > 0) {
				if (remainingBytes >= chunkSize) {
					buffer!.set(chunk, chunkSize)
					remainingBytes -= chunkSize
				} else {
					buffer!.set(chunk.subarray(0, remainingBytes))
					remainingBytes = 0
					yield buffer!

					msgStart = remainingBytes
				}
			}

			const msgSize = readInt32LEInByteArray(chunk, msgStart)
			const msgSizeIncludingDelimiter = msgSize + 4

			if (msgSizeIncludingDelimiter === chunkSize) {
				yield chunk.subarray(4)
			} else if (msgSizeIncludingDelimiter < chunkSize) {
				yield chunk.subarray(0, msgSizeIncludingDelimiter)

				// read next msg size
				const nextMsgSize = readInt32LEInByteArray(
					chunk,
					msgSizeIncludingDelimiter,
				)
				buffer = new Uint8Array(nextMsgSize + 4)
				buffer.set(chunk.subarray(4))

				remainingBytes = msgSize - (chunkSize - 4)
			} else {
				buffer = new Uint8Array(msgSize)
				buffer.set(chunk.subarray(4))
				remainingBytes = msgSize - (chunkSize - 4)
			}
		}
	}

	async sendMessage(message: NanoPackMessage) {
		await this.stdio.stdout(message.bytesWithLengthPrefix())
	}
}

export type { StdIo }
export { StdioMessageChannel }
