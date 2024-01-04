import { createApplication, runApplication } from "poly/application"
import { StdioMessageChannel } from "poly/bridge"
import { createWindow } from "poly/window"

const context = createApplication({
	messageChannel: new StdioMessageChannel({
		async *stdin() {
			for await (const chunk of Bun.stdin.stream()) {
				yield Uint8Array.from(chunk)
			}
		},
		async stdout(data: Uint8Array) {
			await Bun.write(Bun.stdout, data)
		},
	}),
})

const instance = runApplication(context)

createWindow(
	{
		title: "Poly in TypeScript",
		description: "An example Poly application written in TypeScript.",
		width: 600,
		height: 400,
		tag: "main",
	},
	context,
)

await instance
