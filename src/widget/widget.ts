import type { PolyApplication } from "../application.js"
import type { Widget } from "../rpc/widget/widget.np.js"

type WidgetTag = number

abstract class PolyWidget {
	public readonly tag: WidgetTag

	protected constructor(protected readonly context: PolyApplication) {
		this.tag = context.idRegistry.newId()
	}

	abstract descriptor(): Widget

	public async show({ window }: { window: string }) {
		await this.context.nativeLayer.createWidget(this.descriptor(), window)
	}

	public async update(updater: () => void) {
		updater()
		await this.dispatchUpdate()
		return this
	}

	protected async dispatchUpdate() {
		await this.context.nativeLayer.updateWidget(
			this.tag,
			this.descriptor(),
			null,
		)
	}
}

abstract class WidgetController {
	protected constructor(protected readonly context: PolyApplication) {}

	public abstract widget(): PolyWidget
}

export { PolyWidget, WidgetController }
export type { Widget }
export type { WidgetTag }
