function readUint32LE(offset: number, array: Uint8Array) {
	let size = 0
	size |= array[offset]
	size |= array[offset + 1] << 8
	size |= array[offset + 2] << 16
	size |= array[offset + 3] << 24
	return size
}

function writeUint32LE(uint32: number, offset: number, array: Uint8Array) {
	array[offset] = uint32 & 0x000000ff
	array[offset + 1] = (uint32 & 0x0000ff00) >> 8
	array[offset + 2] = (uint32 & 0x00ff0000) >> 16
	array[offset + 3] = (uint32 & 0xff000000) >> 24
}

export { readUint32LE, writeUint32LE }
