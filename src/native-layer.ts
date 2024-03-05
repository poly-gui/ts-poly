import { NanoBufReader, NanoPackMessage } from "nanopack"
import { makeNanoPackMessage } from "./message-factory.np.js"
import { ApplicationContext } from "./application.js"
import { InvokeCallback } from "./messages/invoke-callback.np.js"
import { ReplyFromCallback } from "./messages/reply-from-callback.np.js"
import { Request } from "./messages/request.np.js"
import { OkResponse } from "./messages/ok-response.np.js"

type PromiseResolver = () => void

class NativeLayer {
	context!: ApplicationContext

	private pendingRequests = new Map<number, PromiseResolver>()

	constructor() {}

	async open() {
		for await (const messageBytes of this.context.messageChannel.incomingMessageBytes()) {
			const maybeMessage = makeNanoPackMessage(messageBytes)
			if (maybeMessage) {
				this.handleMessage(maybeMessage.result)
			}
		}
	}

	async sendMessage(message: NanoPackMessage) {
		const requestBody = new NanoBufReader(message.bytes())
		const request = new Request(this.randomRequestId(), requestBody)
		await this.context.messageChannel.sendMessage(request)
		return new Promise<void>((resolve) => {
			this.pendingRequests.set(request.id, resolve)
		})
	}

	private randomRequestId(): number {
		let id: number
		do {
			id = Math.floor(Math.random() * 4294967295)
		} while (this.pendingRequests.has(id))
		return id
	}

	private handleMessage(message: NanoPackMessage) {
		switch (message.typeId) {
			case InvokeCallback.TYPE_ID:
				this.invokeCallback(message as unknown as InvokeCallback)
				break

			case OkResponse.TYPE_ID:
				this.resolveRequest((message as unknown as OkResponse).requestId)
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
