import type { NanoPackMessage } from "nanopack"

interface MessageChannel {
	incomingMessageBytes(): AsyncGenerator<Uint8Array>

	sendMessage(message: NanoPackMessage): Promise<void>
}

export { MessageChannel }
