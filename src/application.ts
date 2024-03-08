import { Channel } from "./bridge/channel.js"
import { CallbackRegistry } from "./callback-registry.js"
import { MessageHandlerRegistry } from "./message-handler-registry.js"
import { IdRegistry } from "./id-registry.js"
import { NativeLayer } from "./native-layer.js"

interface ApplicationConfig {
	messageChannel: Channel
}

interface ApplicationContext {
	messageChannel: Channel
	nativeLayer: NativeLayer
	registries: Map<string, unknown>

	messageHandlers: MessageHandlerRegistry
	callbackRegistry: CallbackRegistry
	idRegistry: IdRegistry

	addRegistry<TReg>(key: string, registry: TReg): void

	getRegistry<TReg>(key: string): TReg | null
}

function createApplication(config: ApplicationConfig): ApplicationContext {
	const registries = new Map()
	registries.set(CallbackRegistry.KEY, new CallbackRegistry())
	registries.set(IdRegistry.KEY, new IdRegistry())
	registries.set(MessageHandlerRegistry.KEY, new MessageHandlerRegistry())

	const context = {
		registries,
		messageChannel: config.messageChannel,
		nativeLayer: new NativeLayer(),

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
	context.nativeLayer.context = context

	return context
}

async function runApplication(context: ApplicationContext) {
	await context.nativeLayer.open()
}

export type { ApplicationContext }
export type { IdRegistry }
export { createApplication, runApplication }
