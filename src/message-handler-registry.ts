type MessageHandler = (messageBytes: Uint8Array) => Promise<void>

class MessageHandlerRegistry {
	private handlers: MessageHandler[] = []

	public addHandler(handler: MessageHandler) {
		this.handlers.push(handler)
	}

	public async handleMessage(messageBytes: Uint8Array) {
		await Promise.all(this.handlers.map((h) => h(messageBytes)))
	}
}

export { MessageHandlerRegistry }
