import type { PolyApplication } from "./application.js"
import type { PolyWidget, Widget } from "./widget/widget.js"

class Window {
	public width = 500
	public height = 300
	public title = "Poly Window"

	private _content: PolyWidget | null = null
	public get content() {
		return this._content
	}

	constructor(
		public readonly context: PolyApplication,
		public readonly tag: string,
	) {}

	public show() {
		this.context.nativeLayer.createWindow(
			this.title,
			"",
			this.width,
			this.height,
			this.tag,
		)
	}

	public showContent(widgetDescriptor: Widget) {
		this.context.nativeLayer.createWidget(widgetDescriptor, this.tag)
	}

	public clearContent() {
		this.context.nativeLayer.clearWindow(this.tag)
	}
}

export { Window }
