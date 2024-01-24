import { MessageChannel } from "./bridge/message-channel.js"
import { CallbackRegistry } from "./callback-registry.js"
import { MessageHandlerRegistry } from "./message-handler-registry.js"
import { NanoPackMessage } from "nanopack"
import { makeNanoPackMessage } from "./message-factory.np.js"
import { readInt32LEInByteArray } from "./util/byte-util.js"
import { InvokeCallback } from "./native-messages/invoke-callback.np.js"
import { IdRegistry } from "./id-registry.js"

interface ApplicationConfig {
	messageChannel: MessageChannel
}

interface ApplicationContext {
	messageChannel: MessageChannel
	messageHandlers: MessageHandlerRegistry
	callbackRegistry: CallbackRegistry
	idRegistry: IdRegistry
}

async function handleMessage(
	message: NanoPackMessage,
	context: ApplicationContext,
) {
	switch (message.typeId) {
		case InvokeCallback.TYPE_ID:
			await invokeCallback(message as unknown as InvokeCallback, context)
			break
	}
}

async function invokeCallback(
	message: InvokeCallback,
	context: ApplicationContext,
) {
	context.callbackRegistry.invokeCallback(message.handle, message.args)
}

function createApplication(config: ApplicationConfig): ApplicationContext {
	return {
		messageChannel: config.messageChannel,
		messageHandlers: new MessageHandlerRegistry(),
		callbackRegistry: new CallbackRegistry(),
		idRegistry: new IdRegistry(),
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
export type { IdRegistry }
export { createApplication, runApplication }
