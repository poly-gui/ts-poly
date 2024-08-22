// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, NanoBufWriter } from "nanopack";

import { Widget } from "./widget.np.js";
import { makeWidget } from "./make-widget.np.js";

class TextField extends Widget {
  public static TYPE_ID = 841129444;

  public override readonly typeId: number = 841129444;

  public override readonly headerSize: number = 20;

  constructor(
    public tag: number | null,
    public placeholder: string | null,
    public value: string,
    public onValueChanged: number,
  ) {
    super(tag);
  }

  public static fromBytes(
    bytes: Buffer,
  ): { bytesRead: number; result: TextField } | null {
    const reader = new NanoBufReader(bytes);
    return TextField.fromReader(reader);
  }

  public static fromReader(
    reader: NanoBufReader,
    offset = 0,
  ): { bytesRead: number; result: TextField } | null {
    let ptr = offset + 20;

    let tag: number | null;
    if (reader.readFieldSize(0, offset) >= 0) {
      tag = reader.readInt32(ptr);
      ptr += 4;
    } else {
      tag = null;
    }

    let placeholder: string | null;
    if (reader.readFieldSize(1, offset) >= 0) {
      const placeholderByteLength = reader.readFieldSize(1, offset);
      placeholder = reader.readString(ptr, placeholderByteLength);
      ptr += placeholderByteLength;
    } else {
      placeholder = null;
    }

    const valueByteLength = reader.readFieldSize(2, offset);
    const value = reader.readString(ptr, valueByteLength);
    ptr += valueByteLength;

    const onValueChanged = reader.readUint32(ptr);
    ptr += 4;

    return {
      bytesRead: ptr - offset,
      result: new TextField(tag, placeholder, value, onValueChanged),
    };
  }

  public override writeTo(writer: NanoBufWriter, offset = 0): number {
    let bytesWritten = 20;

    writer.writeTypeId(841129444, offset);

    if (this.tag) {
      writer.appendInt32(this.tag);
      writer.writeFieldSize(0, 4, offset);
      bytesWritten += 4;
    } else {
      writer.writeFieldSize(0, -1, offset);
    }

    if (this.placeholder) {
      const placeholderByteLength = writer.appendString(this.placeholder);
      writer.writeFieldSize(1, placeholderByteLength, offset);
      bytesWritten += placeholderByteLength;
    } else {
      writer.writeFieldSize(1, -1, offset);
    }

    const valueByteLength = writer.appendString(this.value);
    writer.writeFieldSize(2, valueByteLength, offset);
    bytesWritten += valueByteLength;

    writer.appendUint32(this.onValueChanged);
    writer.writeFieldSize(3, 4, offset);
    bytesWritten += 4;

    return bytesWritten;
  }

  public override bytes(): Uint8Array {
    const writer = new NanoBufWriter(20);
    this.writeTo(writer);
    return writer.bytes;
  }
}

export { TextField };
