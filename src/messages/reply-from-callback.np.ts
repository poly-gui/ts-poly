// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, NanoBufWriter, type NanoPackMessage } from "nanopack"

class ReplyFromCallback implements NanoPackMessage {
	public static TYPE_ID = 370365707

	public readonly typeId: number = 370365707

	public readonly headerSize: number = 12

	constructor(
		public to: number,
		public args: NanoBufReader,
	) {}

	public static fromBytes(
		bytes: Uint8Array,
	): { bytesRead: number; result: ReplyFromCallback } | null {
		const reader = new NanoBufReader(bytes)
		return ReplyFromCallback.fromReader(reader)
	}

	public static fromReader(
		reader: NanoBufReader,
	): { bytesRead: number; result: ReplyFromCallback } | null {
		let ptr = 12

		const to = reader.readInt32(ptr)
		ptr += 4

		const argsByteLength = reader.readFieldSize(1)
		const args = reader.newReaderAt(ptr, ptr + argsByteLength)
		ptr += argsByteLength

		return { bytesRead: ptr, result: new ReplyFromCallback(to, args) }
	}

	public writeTo(writer: NanoBufWriter, offset: number = 0): number {
		let bytesWritten = 12

		writer.writeTypeId(370365707, offset)

		writer.appendInt32(this.to)
		writer.writeFieldSize(0, 4, offset)
		bytesWritten += 4

		writer.writeFieldSize(1, this.args.bytes.byteLength, offset)
		writer.appendBytes(this.args.bytes)
		bytesWritten += this.args.bytes.byteLength

		return bytesWritten
	}

	public bytes(): Uint8Array {
		const writer = new NanoBufWriter(12)
		this.writeTo(writer)
		return writer.bytes
	}
}

export { ReplyFromCallback }
