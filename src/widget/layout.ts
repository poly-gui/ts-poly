const LayoutParams = {
	MIN_CONTENT: -1,
	MATCH_PARENT: -2,
} as const

enum Alignment {
	START = 0,
	END = 1,
	TOP = 2,
	BOTTOM = 3,
	CENTER = 4,
	SPACE_BETWEEN = 5,
	SPACE_AROUND = 6,
	SPACE_EVENLY = 7,
}

export { LayoutParams, Alignment }
