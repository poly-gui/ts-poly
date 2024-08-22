import { PolyWidget, type Widget } from "./widget.js"
import { Center as CenterMessage } from "../rpc/widget/center.np.js"
import type { PolyApplication } from "../application.js"

class Center extends PolyWidget {
	public child: PolyWidget | null = null

	// biome-ignore lint/complexity/noUselessConstructor: this is needed for the ctor to be publically accessible
	public constructor(context: PolyApplication) {
		super(context)
	}

	descriptor(): Widget {
		if (!this.child) {
			throw new Error("Child cannot be null")
		}
		return new CenterMessage(this.tag, this.child.descriptor())
	}
}

export { Center }
