// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, NanoBufWriter, type NanoPackMessage } from "nanopack"

class OkResponse implements NanoPackMessage {
	public static TYPE_ID = 1144955386

	constructor(
		public requestId: number,
		public body: NanoBufReader | null,
	) {}

	public static fromBytes(
		bytes: Uint8Array,
	): { bytesRead: number; result: OkResponse } | null {
		const reader = new NanoBufReader(bytes)
		return OkResponse.fromReader(reader)
	}

	public static fromReader(
		reader: NanoBufReader,
	): { bytesRead: number; result: OkResponse } | null {
		let ptr = 12

		const requestId = reader.readUint32(ptr)
		ptr += 4

		let body: NanoBufReader | null
		if (reader.readFieldSize(1) >= 0) {
			const bodyByteLength = reader.readFieldSize(1)
			body = reader.newReaderAt(ptr, ptr + bodyByteLength)
			ptr += bodyByteLength
		} else {
			body = null
		}

		return { bytesRead: ptr, result: new OkResponse(requestId, body) }
	}

	public get typeId(): number {
		return 1144955386
	}

	public bytes(): Uint8Array {
		const writer = new NanoBufWriter(12)
		writer.writeTypeId(1144955386)

		writer.appendUint32(this.requestId)
		writer.writeFieldSize(0, 4)

		if (this.body) {
			writer.writeFieldSize(1, this.body.bytes.byteLength)
			writer.appendBytes(this.body.bytes)
		} else {
			writer.writeFieldSize(1, -1)
		}

		return writer.bytes
	}

	public bytesWithLengthPrefix(): Uint8Array {
		const writer = new NanoBufWriter(12 + 4, true)
		writer.writeTypeId(1144955386)

		writer.appendUint32(this.requestId)
		writer.writeFieldSize(0, 4)

		if (this.body) {
			writer.writeFieldSize(1, this.body.bytes.byteLength)
			writer.appendBytes(this.body.bytes)
		} else {
			writer.writeFieldSize(1, -1)
		}

		writer.writeLengthPrefix(writer.currentSize - 4)

		return writer.bytes
	}
}

export { OkResponse }