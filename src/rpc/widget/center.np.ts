// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, NanoBufWriter } from "nanopack";

import { Widget } from "./widget.np.js";
import { makeWidget } from "./make-widget.np.js";

class Center extends Widget {
  public static TYPE_ID = 1855640887;

  public override readonly typeId: number = 1855640887;

  public override readonly headerSize: number = 12;

  constructor(
    public tag: number | null,
    public child: Widget,
  ) {
    super(tag);
  }

  public static fromBytes(
    bytes: Buffer,
  ): { bytesRead: number; result: Center } | null {
    const reader = new NanoBufReader(bytes);
    return Center.fromReader(reader);
  }

  public static fromReader(
    reader: NanoBufReader,
    offset = 0,
  ): { bytesRead: number; result: Center } | null {
    let ptr = offset + 12;

    let tag: number | null;
    if (reader.readFieldSize(0, offset) >= 0) {
      tag = reader.readInt32(ptr);
      ptr += 4;
    } else {
      tag = null;
    }

    const maybeChild = Widget.fromReader(reader, ptr);
    if (!maybeChild) {
      return null;
    }
    const child = maybeChild.result;
    ptr += maybeChild.bytesRead;

    return { bytesRead: ptr - offset, result: new Center(tag, child) };
  }

  public override writeTo(writer: NanoBufWriter, offset = 0): number {
    let bytesWritten = 12;

    writer.writeTypeId(1855640887, offset);

    if (this.tag) {
      writer.appendInt32(this.tag);
      writer.writeFieldSize(0, 4, offset);
      bytesWritten += 4;
    } else {
      writer.writeFieldSize(0, -1, offset);
    }

    const childWriteOffset = writer.currentSize;
    writer.reserveHeader(this.child.headerSize);
    const childByteSize = this.child.writeTo(writer, childWriteOffset);
    writer.writeFieldSize(1, childByteSize, offset);
    bytesWritten += childByteSize;

    return bytesWritten;
  }

  public override bytes(): Uint8Array {
    const writer = new NanoBufWriter(12);
    this.writeTo(writer);
    return writer.bytes;
  }
}

export { Center };
