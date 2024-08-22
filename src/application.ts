import { CallbackRegistry } from "./callback-registry.js"
import {
	PortableLayerServiceServer,
	type IPortableLayerService,
} from "./rpc/portable-layer-service.np.js"
import {
	NodeStandardIoRpcChannel,
	type RpcClientChannel,
	type RpcServerChannel,
} from "nanopack/rpc"
import { NativeLayerServiceClient } from "./rpc/native-layer-service.np.js"
import { IdRegistry } from "./id-registry.js"
import { WindowManager, type WindowManagerDelegate } from "./window.js"

type PolyApplicationTransport = { type: "node-stdio" }

interface ApplicationConfig {
	transport: PolyApplicationTransport
}

type PolyApplicationRunLoop = Promise<void>

class PolyApplication {
	public readonly nativeLayer: NativeLayerServiceClient
	public readonly callbackRegistry = new CallbackRegistry()
	public readonly idRegistry = new IdRegistry()

	private rpcChannel: NodeStandardIoRpcChannel
	private rpcServer: PortableLayerServiceServer

	private portableLayerService: IPortableLayerService = {
		invokeCallback: (handle, args) => {
			// biome-ignore lint/style/noNonNullAssertion: <TODO: throw error when callback doesnt return value>
			return this.callbackRegistry.invokeCallback(handle, args)!
		},
		invokeVoidCallback: (handle, args) => {
			this.callbackRegistry.invokeVoidCallback(handle, args)
		},
	}

	private windowManagerDelegate: WindowManagerDelegate = {
		createWindow: (config) => {
			this.nativeLayer.createWindow(
				config.title,
				"",
				config.width,
				config.height,
				config.tag,
			)
		},
	}
	public readonly windowManager = new WindowManager(this.windowManagerDelegate)

	public constructor(private config: ApplicationConfig) {
		this.rpcChannel = new NodeStandardIoRpcChannel()
		this.rpcServer = new PortableLayerServiceServer(
			this.rpcChannel,
			this.portableLayerService,
		)
		this.nativeLayer = new NativeLayerServiceClient(this.rpcChannel)
	}

	public start(): PolyApplicationRunLoop {
		return this.rpcChannel.open()
	}
}

export { PolyApplication }
