import type { PolyApplication } from "../application.js"
import { Column as ColumnMessage } from "../rpc/widget/column.np.js"
import { Alignment, LayoutParams } from "./layout.js"
import { PolyWidget, type Widget } from "./widget.js"

class Column extends PolyWidget {
	public width: number = LayoutParams.MIN_CONTENT
	public height: number = LayoutParams.MIN_CONTENT
	public horizontalAlignment = Alignment.CENTER
	public verticalAlignment = Alignment.CENTER
	private children: PolyWidget[] = []

	// biome-ignore lint/complexity/noUselessConstructor: this is needed for the ctor to be publically accessible
	public constructor(context: PolyApplication) {
		super(context)
	}

	public addChildren(...children: PolyWidget[]): void {
		this.children.push(...children)
	}

	public descriptor(): Widget {
		return new ColumnMessage(
			this.tag,
			this.width,
			this.height,
			this.horizontalAlignment,
			this.verticalAlignment,
			this.children.map((widget) => widget.descriptor()),
		)
	}
}

export { Column }
