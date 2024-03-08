import { NanoBufReader, NanoPackMessage } from "nanopack"
import { ApplicationContext } from "./application.js"
import { InvokeCallback } from "./messages/invoke-callback.np.js"
import { ReplyFromCallback } from "./messages/reply-from-callback.np.js"
import {
	type Packet,
	type Request,
	PACKET_TYPE_ACK,
	PACKET_TYPE_REQUEST,
} from "./bridge/channel-packet.js"

type PromiseResolver = () => void

class NativeLayer {
	context!: ApplicationContext

	private pendingRequests = new Map<number, PromiseResolver>()

	constructor() {}

	async open() {
		for await (const packet of this.context.messageChannel.incomingPackets()) {
			this.handlePacket(packet)
		}
	}

	async sendMessage(message: NanoPackMessage) {
		const request: Request = {
			type: PACKET_TYPE_REQUEST,
			id: this.randomRequestId(),
			body: message,
		}
		await this.context.messageChannel.sendRequest(request)
		return new Promise<void>((resolve) => {
			this.pendingRequests.set(request.id, resolve)
		})
	}

	private randomRequestId(): number {
		let id: number
		do {
			id = Math.floor(Math.random() * 4294967294) + 1
		} while (this.pendingRequests.has(id))
		return id
	}

	private async handlePacket(packet: Packet) {
		switch (packet.type) {
			case PACKET_TYPE_REQUEST:
				await this.handleMessage(packet.body)
				break

			case PACKET_TYPE_ACK:
				this.resolveRequest(packet.requestId)
				break
		}
	}

	private async handleMessage(message: NanoPackMessage) {
		switch (message.typeId) {
			case InvokeCallback.TYPE_ID:
				await this.invokeCallback(message as unknown as InvokeCallback)
				break

			default:
				break
		}
	}

	private async invokeCallback(message: InvokeCallback) {
		const result = this.context.callbackRegistry.invokeCallback(
			message.handle,
			message.args,
		)
		if (result && message.replyTo) {
			await this.sendMessage(
				new ReplyFromCallback(
					message.replyTo,
					new NanoBufReader(result.bytes()),
				),
			)
		}
	}

	private resolveRequest(id: number) {
		const resolve = this.pendingRequests.get(id)
		if (resolve) {
			this.pendingRequests.delete(id)
			resolve()
		}
	}
}

export { NativeLayer }
