import { ApplicationContext } from "../application.js"
import { CreateWindow } from "./create-window.np.js"

interface WindowConfig {
	title: string
	description: string
	width: number
	height: number
	tag: string
}

async function createWindow(config: WindowConfig, context: ApplicationContext) {
	const createWindowMessage = new CreateWindow(
		config.title,
		config.description,
		config.width,
		config.height,
		config.tag,
	)
	await context.nativeLayer.sendMessage(createWindowMessage)
}

export type { WindowConfig }
export { createWindow }
