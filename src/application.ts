import { MessageChannel } from "./bridge/message-channel.js"
import { CallbackHandle, CallbackRegistry } from "./callback-registry.js"
import { NanoPackMessage } from "nanopack"
import { makeNanoPackMessage } from "./message-factory.js"
import { readInt32LEInByteArray } from "./util/byte-util.js"
import { InvokeCallback } from "./native-messages/invoke-callback.np.js"

interface ApplicationConfig {
	messageChannel: MessageChannel
}

interface ApplicationContext {
	messageChannel: MessageChannel
	callbackRegistry: CallbackRegistry
}

async function handleMessage(
	message: NanoPackMessage,
	context: ApplicationContext,
) {
	switch (message.typeId) {
		case InvokeCallback.TYPE_ID:
			await invokeCallback(
				(message as unknown as InvokeCallback).handle,
				context,
			)
			break
	}
}

async function invokeCallback(
	handle: CallbackHandle,
	context: ApplicationContext,
) {
	const cb = context.callbackRegistry.findCallback(handle)
	if (cb) {
		cb()
	}
}

function createApplication(config: ApplicationConfig): ApplicationContext {
	return {
		messageChannel: config.messageChannel,
		callbackRegistry: new CallbackRegistry(),
	}
}

async function runApplication(context: ApplicationContext) {
	for await (const messageBytes of context.messageChannel.incomingMessageBytes()) {
		const typeId = readInt32LEInByteArray(messageBytes, 0)
		const maybeMessage = makeNanoPackMessage(messageBytes, typeId)
		if (maybeMessage) {
			await handleMessage(maybeMessage.result, context)
		}
	}
}

export type { ApplicationContext }
export { createApplication, runApplication }
