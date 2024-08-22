// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

import { NanoBufReader, type NanoPackMessage } from "nanopack";

import { Button } from "./widget/button.np.js";
import { ClickEvent } from "./event/click-event.np.js";
import { TextField } from "./widget/text-field.np.js";
import { Row } from "./widget/row.np.js";
import { ListViewItem } from "./widget/list-view-item.np.js";
import { Widget } from "./widget/widget.np.js";
import { Center } from "./widget/center.np.js";
import { ListViewInsertOperation } from "./widget/list-view-insert-operation.np.js";
import { ListView } from "./widget/list-view.np.js";
import { ListViewDeleteOperation } from "./widget/list-view-delete-operation.np.js";
import { TextFieldChangedEvent } from "./widget/text-field-changed-event.np.js";
import { Column } from "./widget/column.np.js";
import { Text } from "./widget/text.np.js";
import { ListViewOperation } from "./widget/list-view-operation.np.js";
import { ListViewBatchOperations } from "./widget/list-view-batch-operations.np.js";
import { FontStyle } from "./widget/font-style.np.js";
import { ListViewItemConfig } from "./widget/list-view-item-config.np.js";

function makeNanoPackMessage(
  reader: NanoBufReader,
  offset = 0,
): { bytesRead: number; result: NanoPackMessage } | null {
  switch (reader.readTypeId(offset)) {
    case 320412644:
      return Button.fromReader(reader, offset);
    case 837166865:
      return ClickEvent.fromReader(reader, offset);
    case 841129444:
      return TextField.fromReader(reader, offset);
    case 1006836449:
      return Row.fromReader(reader, offset);
    case 1100735111:
      return ListViewItem.fromReader(reader, offset);
    case 1676374721:
      return Widget.fromReader(reader, offset);
    case 1855640887:
      return Center.fromReader(reader, offset);
    case 2077451345:
      return ListViewInsertOperation.fromReader(reader, offset);
    case 2164488861:
      return ListView.fromReader(reader, offset);
    case 2223513129:
      return ListViewDeleteOperation.fromReader(reader, offset);
    case 2286117075:
      return TextFieldChangedEvent.fromReader(reader, offset);
    case 2415007766:
      return Column.fromReader(reader, offset);
    case 3495336243:
      return Text.fromReader(reader, offset);
    case 3516816492:
      return ListViewOperation.fromReader(reader, offset);
    case 3604546751:
      return ListViewBatchOperations.fromReader(reader, offset);
    case 3635009167:
      return FontStyle.fromReader(reader, offset);
    case 4128951807:
      return ListViewItemConfig.fromReader(reader, offset);
    default:
      return null;
  }
}

export { makeNanoPackMessage };
