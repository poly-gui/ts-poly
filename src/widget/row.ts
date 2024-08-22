import type { PolyApplication } from "../application.js"
import { Row as RowMessage } from "../rpc/widget/row.np.js"
import { Alignment, LayoutParams } from "./layout.js"
import { PolyWidget, type Widget } from "./widget.js"

class Row extends PolyWidget {
	public width = LayoutParams.MIN_CONTENT
	public height = LayoutParams.MIN_CONTENT
	public horizontalAlignment = Alignment.CENTER
	public verticalAlignment = Alignment.CENTER

	private children: PolyWidget[] = []

	// biome-ignore lint/complexity/noUselessConstructor: this is needed for the ctor to be publically accessible
	public constructor(context: PolyApplication) {
		super(context)
	}

	public addChildren(...children: PolyWidget[]) {
		this.children.push(...children)
	}

	override descriptor(): Widget {
		return new RowMessage(
			this.tag,
			this.width,
			this.height,
			this.horizontalAlignment,
			this.verticalAlignment,
			this.children.map((child) => child.descriptor()),
		)
	}
}

export { Row }
