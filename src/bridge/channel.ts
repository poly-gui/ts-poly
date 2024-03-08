import type { Packet, Request } from "./channel-packet.js"

interface Channel {
	incomingPackets(): AsyncGenerator<Packet>

	sendRequest(request: Request): Promise<void>

	sendAck(requestId: number): Promise<void>
}

export type { Channel }
