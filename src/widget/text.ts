import type { FontStyle } from "./style/font-style.js"
import { PolyWidget, type Widget } from "./widget.js"
import { FontStyle as FontStyleMessage } from "../rpc/widget/font-style.np.js"
import { Text as TextMessage } from "../rpc/widget/text.np.js"
import type { PolyApplication } from "../application.js"

class Text extends PolyWidget {
	public content = ""

	public font: FontStyle = {
		family: "",
		size: 12,
		weight: 400,
	}

	// biome-ignore lint/complexity/noUselessConstructor: this is needed for the ctor to be publically accessible
	public constructor(context: PolyApplication) {
		super(context)
	}

	descriptor(): Widget {
		const fontStyle = new FontStyleMessage(
			this.font.family,
			this.font.weight,
			this.font.size,
		)
		return new TextMessage(this.tag, this.content, fontStyle)
	}
}

export { Text }
