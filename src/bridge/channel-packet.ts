import type { NanoPackMessage } from "nanopack"
import { readUint32LE } from "../util/byte-util.js"
import { makeNanoPackMessage } from "../message-factory.np.js"

const PACKET_TYPE_REQUEST = 0
const PACKET_TYPE_ACK = 1

type Packet = Request | Ack

interface Request {
	type: typeof PACKET_TYPE_REQUEST
	id: number
	body: NanoPackMessage
}

interface Ack {
	type: typeof PACKET_TYPE_ACK
	requestId: number
}

function packetFromBytes(bytes: Uint8Array): Packet | null {
	const requestId = readUint32LE(0, bytes)
	const size = readUint32LE(4, bytes)

	if (size === 0) {
		return {
			type: PACKET_TYPE_ACK,
			requestId,
		}
	}

	const parsed = makeNanoPackMessage(bytes.subarray(8))
	if (!parsed) return null

	return {
		type: PACKET_TYPE_REQUEST,
		id: requestId,
		body: parsed.result,
	}
}

export { PACKET_TYPE_REQUEST, PACKET_TYPE_ACK }
export { Request, Ack, Packet, packetFromBytes }
