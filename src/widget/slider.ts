import { PolyWidget, type Widget } from "./widget.js"
import { Slider as SliderMessage } from "../rpc/widget/slider.np.js"
import type { SliderValueChangedEvent } from "../rpc/widget/slider-value-changed-event.np.js"
import type { PolyApplication } from "../application.js"
import type { CallbackHandle } from "../callback-registry.js"
import type { NanoPackMessage } from "nanopack"
import { LayoutParams } from "./layout.js"

interface SliderChangedEvent {
	newValue: number
}

type SliderChangedCallback = (event: SliderChangedEvent) => void

class Slider extends PolyWidget {
	public value = 0
	public minValue = 0
	public maxValue = 100
	public width: number = LayoutParams.MIN_CONTENT
	public onChanged: SliderChangedCallback | null = null

	private onValueChangedHandle: CallbackHandle

	constructor(context: PolyApplication) {
		super(context)
		this.onValueChangedHandle = context.callbackRegistry.newVoidCallback(
			this.onValueChanged.bind(this),
		)
	}

	descriptor(): Widget {
		return new SliderMessage(
			this.tag,
			this.value,
			this.minValue,
			this.maxValue,
			this.onValueChangedHandle,
			this.width,
		)
	}

	private onValueChanged(arg: NanoPackMessage) {
		this.onChanged?.(arg as SliderValueChangedEvent)
	}
}

export { Slider }
export type { SliderChangedCallback, SliderChangedEvent }
