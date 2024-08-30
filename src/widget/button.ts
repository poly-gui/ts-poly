import type { NanoPackMessage } from "nanopack"
import type { PolyApplication } from "../application.js"
import type { ClickEvent as ClickEventMessage } from "../rpc/event/click-event.np.js"
import { Button as ButtonMessage } from "../rpc/widget/button.np.js"
import { PolyWidget, type Widget } from "./widget.js"
import type { ClickEvent } from "./event/click-event.js"

type ButtonOnClickCallback = (event: ClickEvent) => void

class Button extends PolyWidget {
	public label = ""
	public onClick: ButtonOnClickCallback | null = null

	private readonly onClickHandle: number

	public constructor(context: PolyApplication) {
		super(context)
		this.onClickHandle = context.callbackRegistry.newVoidCallback(
			this.onClickEvent.bind(this),
		)
	}

	descriptor(): Widget {
		return new ButtonMessage(this.tag, this.label, this.onClickHandle)
	}

	private onClickEvent(arg: unknown) {
		this.onClick?.(arg as ClickEventMessage)
	}
}

export { Button }
