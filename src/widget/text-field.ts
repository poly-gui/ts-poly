import type { NanoPackMessage } from "nanopack"
import { PolyWidget, type Widget } from "./widget.js"
import type { TextFieldChangedEvent as TextFieldChangedEventMessage } from "../rpc/widget/text-field-changed-event.np.js"
import { TextField as TextFieldMessage } from "../rpc/widget/text-field.np.js"
import type { PolyApplication } from "../application.js"

interface TextFieldChangedEvent {
	newValue: string
}

type TextFieldChangedCallback = (event: TextFieldChangedEvent) => void

class TextField extends PolyWidget {
	public placeholder = ""
	public value = ""
	public onChanged: TextFieldChangedCallback | null = null

	private readonly onValueChangedHandle: number

	public constructor(context: PolyApplication) {
		super(context)
		this.onValueChangedHandle = this.context.callbackRegistry.newVoidCallback(
			this.onValueChangedEvent.bind(this),
		)
	}

	descriptor(): Widget {
		return new TextFieldMessage(
			this.tag,
			this.placeholder,
			this.value,
			this.onValueChangedHandle,
		)
	}

	private onValueChangedEvent(args: NanoPackMessage) {
		const event = args as TextFieldChangedEventMessage
		this.value = event.newValue
		this.onChanged?.(event)
	}
}

export { TextField }
export type { TextFieldChangedCallback, TextFieldChangedEvent }
