import { MessageChannel } from "./message-channel.js"
import { NanoPackMessage } from "nanopack"

interface StdIo {
	stdin(): AsyncGenerator<Uint8Array>

	stdout(data: Uint8Array): Promise<void>
}

class StdioMessageChannel implements MessageChannel {
	constructor(private stdio: StdIo) {}

	async *incomingMessageBytes(): AsyncGenerator<Uint8Array> {
		for await (const chunk of this.stdio.stdin()) {
			yield chunk.subarray(4)
		}
	}

	async sendMessage(message: NanoPackMessage) {
		await this.stdio.stdout(message.bytesWithLengthPrefix())
	}
}

export type { StdIo }
export { StdioMessageChannel }
