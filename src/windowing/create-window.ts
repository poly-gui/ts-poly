import { ApplicationContext } from "../application.js"
import { CreateWindow } from "./create-window.np.js"

interface WindowConfig {
	title: string
	description: string
	width: number
	height: number
}

async function createWindow(config: WindowConfig, context: ApplicationContext) {
	const createWindowMessage = new CreateWindow(
		config.title,
		config.description,
		config.width,
		config.height,
	)
	await context.messageChannel.sendMessage(createWindowMessage)
}

export type { WindowConfig }
export { createWindow }
