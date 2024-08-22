type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

interface FontStyle {
	family: string
	size: number
	weight: FontWeight
}

export type { FontStyle, FontWeight }
