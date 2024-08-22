interface WindowConfig {
	tag: string
	width: number
	height: number
	title: string
}

interface Window {
	tag: string
	width: number
	height: number
	title: string
}

interface WindowManagerDelegate {
	createWindow(config: WindowConfig): void
}

class WindowManager {
	private activeWindows = new Map<string, Window>()

	constructor(private delegate: WindowManagerDelegate) {}

	public createAndShowWindow(config: WindowConfig) {
		if (this.activeWindows.has(config.tag)) {
			return
		}
		const window: Window = {
			tag: config.tag,
			width: config.width,
			height: config.height,
			title: config.title,
		}
		this.delegate.createWindow(config)
		this.activeWindows.set(config.tag, window)
	}
}

export type { Window, WindowConfig, WindowManagerDelegate }
export { WindowManager }
