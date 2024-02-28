// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, NanoBufWriter, type NanoPackMessage } from "nanopack"

class InvokeCallback implements NanoPackMessage {
	public static TYPE_ID = 2013877267

	constructor(
		public handle: number,
		public args: NanoBufReader,
		public replyTo: number | null,
	) {}

	public static fromBytes(
		bytes: Uint8Array,
	): { bytesRead: number; result: InvokeCallback } | null {
		const reader = new NanoBufReader(bytes)
		return InvokeCallback.fromReader(reader)
	}

	public static fromReader(
		reader: NanoBufReader,
	): { bytesRead: number; result: InvokeCallback } | null {
		let ptr = 16

		const handle = reader.readInt32(ptr)
		ptr += 4

		const argsByteLength = reader.readFieldSize(1)
		const args = reader.newReaderAt(ptr, ptr + argsByteLength)
		ptr += argsByteLength

		let replyTo: number | null
		if (reader.readFieldSize(2) >= 0) {
			replyTo = reader.readInt32(ptr)
			ptr += 4
		} else {
			replyTo = null
		}

		return { bytesRead: ptr, result: new InvokeCallback(handle, args, replyTo) }
	}

	public get typeId(): number {
		return 2013877267
	}

	public bytes(): Uint8Array {
		const writer = new NanoBufWriter(16)
		writer.writeTypeId(2013877267)

		writer.appendInt32(this.handle)
		writer.writeFieldSize(0, 4)

		writer.writeFieldSize(1, this.args.bytes.byteLength)
		writer.appendBytes(this.args.bytes)

		if (this.replyTo) {
			writer.appendInt32(this.replyTo)
			writer.writeFieldSize(2, 4)
		} else {
			writer.writeFieldSize(2, -1)
		}

		return writer.bytes
	}

	public bytesWithLengthPrefix(): Uint8Array {
		const writer = new NanoBufWriter(16 + 4, true)
		writer.writeTypeId(2013877267)

		writer.appendInt32(this.handle)
		writer.writeFieldSize(0, 4)

		writer.writeFieldSize(1, this.args.bytes.byteLength)
		writer.appendBytes(this.args.bytes)

		if (this.replyTo) {
			writer.appendInt32(this.replyTo)
			writer.writeFieldSize(2, 4)
		} else {
			writer.writeFieldSize(2, -1)
		}

		writer.writeLengthPrefix(writer.currentSize - 4)

		return writer.bytes
	}
}

export { InvokeCallback }
