function readInt32LEInByteArray(array: Uint8Array, offset: number) {
	let size = 0
	size |= array[offset]
	size |= array[offset + 1] << 8
	size |= array[offset + 2] << 16
	size |= array[offset + 3] << 24
	return size
}

export { readInt32LEInByteArray }
