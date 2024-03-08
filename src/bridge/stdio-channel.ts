import { Channel } from "./channel.js"
import { NanoBufWriter } from "nanopack"
import { Packet, Request, packetFromBytes } from "./channel-packet.js"
import { writeUint32LE } from "../util/byte-util.js"

interface StdIo {
	stdin(): AsyncGenerator<Uint8Array>

	stdout(data: Uint8Array): Promise<void>
}

class StdioChannel implements Channel {
	constructor(private stdio: StdIo) {}

	async *incomingPackets(): AsyncGenerator<Packet> {
		for await (const chunk of this.stdio.stdin()) {
			const packet = packetFromBytes(chunk)
			if (packet) yield packet
		}
	}

	async sendRequest(request: Request) {
		const writer = new NanoBufWriter(request.body.headerSize + 8)
		writer.writeUint32LE(request.id, 0)
		const bodySize = request.body.writeTo(writer, 8)
		writer.writeUint32LE(bodySize, 4)
		await this.stdio.stdout(writer.bytes)
	}

	async sendAck(requestId: number) {
		const bytes = new Uint8Array(8)
		writeUint32LE(requestId, 0, bytes)
		writeUint32LE(0, 0, bytes)
		await this.stdio.stdout(bytes)
	}
}

export type { StdIo }
export { StdioChannel }
