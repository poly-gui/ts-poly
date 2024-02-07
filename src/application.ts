import { MessageChannel } from "./bridge/message-channel.js"
import { CallbackRegistry } from "./callback-registry.js"
import { MessageHandlerRegistry } from "./message-handler-registry.js"
import { NanoPackMessage } from "nanopack"
import { makeNanoPackMessage } from "./message-factory.np.js"
import { InvokeCallback } from "./native-messages/invoke-callback.np.js"
import { IdRegistry } from "./id-registry.js"

interface ApplicationConfig {
	messageChannel: MessageChannel
}

interface ApplicationContext {
	messageChannel: MessageChannel
	registries: Map<string, unknown>

	messageHandlers: MessageHandlerRegistry
	callbackRegistry: CallbackRegistry
	idRegistry: IdRegistry

	addRegistry<TReg>(key: string, registry: TReg): void

	getRegistry<TReg>(key: string): TReg | null
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
	const registries = new Map()
	registries.set(CallbackRegistry.KEY, new CallbackRegistry())
	registries.set(IdRegistry.KEY, new IdRegistry())
	registries.set(MessageHandlerRegistry.KEY, new MessageHandlerRegistry())

	return {
		registries,
		messageChannel: config.messageChannel,

		get messageHandlers(): MessageHandlerRegistry {
			return this.getRegistry<MessageHandlerRegistry>(
				MessageHandlerRegistry.KEY,
			)!
		},

		get callbackRegistry(): CallbackRegistry {
			return this.getRegistry<CallbackRegistry>(CallbackRegistry.KEY)!
		},

		get idRegistry(): IdRegistry {
			return this.getRegistry<IdRegistry>(IdRegistry.KEY)!
		},

		addRegistry<TReg>(key: string, registry: TReg) {
			this.registries.set(key, registry)
		},

		getRegistry<TReg>(key: string): TReg | null {
			return (this.registries.get(key) as TReg) ?? null
		},
	}
}

async function runApplication(context: ApplicationContext) {
	for await (const messageBytes of context.messageChannel.incomingMessageBytes()) {
		const maybeMessage = makeNanoPackMessage(messageBytes)
		if (maybeMessage) {
			await handleMessage(maybeMessage.result, context)
		}
	}
}

export type { ApplicationContext }
export type { IdRegistry }
export { createApplication, runApplication }
