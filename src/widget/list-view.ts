import type { PolyApplication } from "../application.js"
import { ListViewBatchOperations } from "../rpc/widget/list-view-batch-operations.np.js"
import { ListViewDeleteOperation } from "../rpc/widget/list-view-delete-operation.np.js"
import { ListViewInsertOperation } from "../rpc/widget/list-view-insert-operation.np.js"
import type { ListViewItemConfig } from "../rpc/widget/list-view-item-config.np.js"
import { ListViewItem as ListViewItemMsg } from "../rpc/widget/list-view-item.np.js"
import type { ListViewOperation } from "../rpc/widget/list-view-operation.np.js"
import { ListView as ListViewMsg } from "../rpc/widget/list-view.np.js"
import { LayoutParams } from "./layout.js"
import { PolyWidget, type Widget, WidgetController } from "./widget.js"

type ListViewCreateItemCallback<TItem extends ListViewItem> = () => TItem

type ListViewBindItemCallback<TItem extends ListViewItem> = ({
	sectionIndex,
	itemIndex,
	item,
}: {
	sectionIndex: number
	itemIndex: number
	item: TItem
}) => PolyWidget[]

class ListView<TItem extends ListViewItem> extends PolyWidget {
	public width: number = LayoutParams.MIN_CONTENT
	public height: number = LayoutParams.MIN_CONTENT
	public itemCount = 0
	public itemHeight = 0
	public onCreate: ListViewCreateItemCallback<TItem> | null = null
	public onBind: ListViewBindItemCallback<TItem> | null = null

	private items = new Map<number, TItem>()
	private pendingOperations: ListViewOperation[] = []

	private readonly onCreateHandle: number
	private readonly onBindHandle: number

	public constructor(context: PolyApplication) {
		super(context)

		this.onCreateHandle = context.callbackRegistry.newCallback(
			this.onRequestCreate.bind(this),
		)
		this.onBindHandle = context.callbackRegistry.newVoidCallback(
			this.onRequestBind.bind(this),
		)
	}

	public override descriptor(): Widget {
		return new ListViewMsg(
			this.tag,
			this.width,
			this.height,
			[this.itemCount],
			this.itemHeight,
			this.onCreateHandle,
			this.onBindHandle,
		)
	}

	protected override async dispatchUpdate() {
		const batchOperations = new ListViewBatchOperations(this.pendingOperations)
		await this.context.nativeLayer.updateWidget(
			this.tag,
			this.descriptor(),
			batchOperations,
		)
		this.pendingOperations = []
	}

	public appendItem() {
		this.itemCount += 1
		const insertOperation = new ListViewInsertOperation(this.tag, [
			this.itemCount - 1,
		])
		this.pendingOperations.push(insertOperation)
	}

	public insertItems(...indices: number[]) {
		this.itemCount += indices.length
		const insertOperation = new ListViewInsertOperation(this.tag, indices)
		this.pendingOperations.push(insertOperation)
	}

	public deleteItems(...indices: number[]) {
		this.itemCount -= indices.length
		const removeOperation = new ListViewDeleteOperation(this.tag, indices)
		this.pendingOperations.push(removeOperation)
	}

	private onRequestCreate(args: unknown): ListViewItemMsg | null {
		if (!this.onCreate || !this.onBind) {
			return null
		}

		const itemConfig = args as ListViewItemConfig

		const { sectionIndex, itemIndex } = itemConfig
		const listViewItem = this.onCreate()
		const itemTag = this.context.idRegistry.newId()
		this.items.set(itemTag, listViewItem)

		if (sectionIndex !== null && itemIndex !== null) {
			this.onBind({ sectionIndex, itemIndex, item: listViewItem })
		}

		return new ListViewItemMsg(itemTag, listViewItem.widget().descriptor())
	}

	private onRequestBind(arg: unknown) {
		if (!this.onBind) return
		const { sectionIndex, itemIndex, itemTag } = arg as ListViewItemConfig
		if (itemTag === null || sectionIndex === null || itemIndex === null) return

		const listViewItem = this.items.get(itemTag)
		if (!listViewItem) return

		const updates = this.onBind({ sectionIndex, itemIndex, item: listViewItem })

		const tags: number[] = []
		const updatedWidgets: Widget[] = []
		for (const update of updates) {
			tags.push(update.tag)
			updatedWidgets.push(update.descriptor())
		}

		this.context.nativeLayer.updateWidgets(tags, updatedWidgets, null)
	}
}

abstract class ListViewItem extends WidgetController {
	public readonly tag: number = 0

	protected constructor(context: PolyApplication) {
		super(context)
		this.tag = context.idRegistry.newId()
	}
}

export { ListView, ListViewItem }
export type { ListViewCreateItemCallback, ListViewBindItemCallback }
