import { NanoBufWriter } from "nanopack"
import { stdout, stdin } from "node:process"
import { Channel } from "./channel.js"
import {
	Packet,
	Request,
	PACKET_TYPE_ACK,
	PACKET_TYPE_REQUEST,
} from "./channel-packet.js"
import { readUint32LE, writeUint32LE } from "../util/byte-util.js"
import { makeNanoPackMessage } from "../message-factory.np.js"

class StdioChannel implements Channel {
	async *incomingPackets(): AsyncGenerator<Packet> {
		let chunk: Buffer
		while ((chunk = stdin.read(8)) !== null) {
			const requestId = readUint32LE(0, chunk)
			const size = readUint32LE(4, chunk)

			if (size === 0) {
				yield { requestId, type: PACKET_TYPE_ACK }
			}

			const msgBytes = stdin.read(size)
			if (msgBytes === null) continue

			const parsed = makeNanoPackMessage(msgBytes)
			if (!parsed) continue

			return {
				type: PACKET_TYPE_REQUEST,
				id: requestId,
				body: parsed.result,
			}
		}
	}

	async sendRequest(request: Request) {
		const writer = new NanoBufWriter(request.body.headerSize + 8)
		writer.writeUint32LE(request.id, 0)
		const bodySize = request.body.writeTo(writer, 8)
		writer.writeUint32LE(bodySize, 4)
		stdout.write(writer.bytes)
	}

	async sendAck(requestId: number) {
		const bytes = new Uint8Array(8)
		writeUint32LE(requestId, 0, bytes)
		writeUint32LE(0, 0, bytes)
		stdout.write(bytes)
	}
}

export { StdioChannel }
