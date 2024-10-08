// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, NanoBufWriter } from "nanopack";

import { ListViewOperation } from "./list-view-operation.np.js";
import { makeListViewOperation } from "./make-list-view-operation.np.js";

class ListViewInsertOperation extends ListViewOperation {
  public static TYPE_ID = 2077451345;

  public override readonly typeId: number = 2077451345;

  public override readonly headerSize: number = 12;

  constructor(
    public tag: number,
    public insertAt: number[],
  ) {
    super(tag);
  }

  public static fromBytes(
    bytes: Buffer,
  ): { bytesRead: number; result: ListViewInsertOperation } | null {
    const reader = new NanoBufReader(bytes);
    return ListViewInsertOperation.fromReader(reader);
  }

  public static fromReader(
    reader: NanoBufReader,
    offset = 0,
  ): { bytesRead: number; result: ListViewInsertOperation } | null {
    let ptr = offset + 12;

    const tag = reader.readUint32(ptr);
    ptr += 4;

    const insertAtByteLength = reader.readFieldSize(1, offset);
    const insertAtLength = insertAtByteLength / 4;
    const insertAt: number[] = new Array(insertAtLength);
    for (let i = 0; i < insertAtLength; i++) {
      const iItem = reader.readInt32(ptr);
      ptr += 4;
      insertAt[i] = iItem;
    }

    return {
      bytesRead: ptr - offset,
      result: new ListViewInsertOperation(tag, insertAt),
    };
  }

  public override writeTo(writer: NanoBufWriter, offset = 0): number {
    let bytesWritten = 12;

    writer.writeTypeId(2077451345, offset);

    writer.appendUint32(this.tag);
    writer.writeFieldSize(0, 4, offset);
    bytesWritten += 4;

    const insertAtByteLength = this.insertAt.length * 4;
    writer.writeFieldSize(1, insertAtByteLength, offset);
    for (const insertAt of this.insertAt) {
      writer.appendInt32(insertAt);
    }
    bytesWritten += insertAtByteLength;

    return bytesWritten;
  }

  public override bytes(): Uint8Array {
    const writer = new NanoBufWriter(12);
    this.writeTo(writer);
    return writer.bytes;
  }
}

export { ListViewInsertOperation };
