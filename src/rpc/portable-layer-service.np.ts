// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufWriter } from "nanopack";
import {
  RpcServer,
  RpcClient,
  RpcMessageType,
  type RpcServerChannel,
} from "nanopack/rpc";

import type { NanoPackMessage } from "nanopack";
import { makeNanoPackMessage } from "./message-factory.np.js";

interface IPortableLayerService {
  invokeVoidCallback(handle: number, args: NanoPackMessage): void;
  invokeCallback(handle: number, args: NanoPackMessage): NanoPackMessage;
}

class PortableLayerServiceServer extends RpcServer {
  constructor(
    channel: RpcServerChannel,
    private impl: IPortableLayerService,
  ) {
    super(channel);
    this.on("invoke_void_callback", (reader, offset, msgId) => {
      let ptr = offset;
      const handle = reader.readUint32(ptr);
      ptr += 4;
      const maybeArgs = makeNanoPackMessage(reader, ptr);
      if (!maybeArgs) {
        return null;
      }
      const args = maybeArgs.result;
      ptr += maybeArgs.bytesRead;

      this.impl.invokeVoidCallback(handle, args);
      const writer = new NanoBufWriter(6, false);
      writer.appendUint8(RpcMessageType.RESPONSE);
      writer.appendUint32(msgId);
      writer.appendUint8(0);

      return writer;
    });
    this.on("invoke_callback", (reader, offset, msgId) => {
      let ptr = offset;
      const handle = reader.readUint32(ptr);
      ptr += 4;
      const maybeArgs = makeNanoPackMessage(reader, ptr);
      if (!maybeArgs) {
        return null;
      }
      const args = maybeArgs.result;
      ptr += maybeArgs.bytesRead;

      const result = this.impl.invokeCallback(handle, args);
      const writer = new NanoBufWriter(6, false);
      writer.appendUint8(RpcMessageType.RESPONSE);
      writer.appendUint32(msgId);
      writer.appendUint8(0);
      const resultWriteOffset = writer.currentSize;
      writer.reserveHeader(result.headerSize);
      const resultByteSize = result.writeTo(writer, resultWriteOffset);
      return writer;
    });
  }
}

class PortableLayerServiceClient extends RpcClient {
  async invokeVoidCallback(
    handle: number,
    args: NanoPackMessage,
  ): Promise<void> {
    const writer = new NanoBufWriter(9 + 20, false);
    const msgId = this.newMessageId();
    writer.appendUint8(RpcMessageType.REQUEST);
    writer.appendUint32(msgId);
    writer.appendStringAndSize("invoke_void_callback");
    writer.appendUint32(handle);
    const argsWriteOffset = writer.currentSize;
    writer.reserveHeader(args.headerSize);
    const argsByteSize = args.writeTo(writer, argsWriteOffset);

    const reader = await this.sendRequestData(msgId, writer.bytes);
    let ptr = 5;
    const errFlag = reader.readUint8(ptr++);
    if (errFlag) {
      throw new Error("error");
    }
  }
  async invokeCallback(
    handle: number,
    args: NanoPackMessage,
  ): Promise<NanoPackMessage> {
    const writer = new NanoBufWriter(9 + 15, false);
    const msgId = this.newMessageId();
    writer.appendUint8(RpcMessageType.REQUEST);
    writer.appendUint32(msgId);
    writer.appendStringAndSize("invoke_callback");
    writer.appendUint32(handle);
    const argsWriteOffset = writer.currentSize;
    writer.reserveHeader(args.headerSize);
    const argsByteSize = args.writeTo(writer, argsWriteOffset);

    const reader = await this.sendRequestData(msgId, writer.bytes);
    let ptr = 5;
    const errFlag = reader.readUint8(ptr++);
    if (errFlag) {
      throw new Error("error");
    }

    const maybeResult = makeNanoPackMessage(reader, ptr);
    if (!maybeResult) {
      throw new Error("deserialization error");
    }
    const result = maybeResult.result;
    ptr += maybeResult.bytesRead;
    return result;
  }
}

export { PortableLayerServiceServer, PortableLayerServiceClient };
export type { IPortableLayerService };