// AUTOMATICALLY GENERATED BY NANOPACK. DO NOT MODIFY BY HAND.

const Alignment = {
  START: 0,
  END: 1,
  TOP: 2,
  BOTTOM: 3,
  CENTER: 4,
  SPACE_BETWEEN: 5,
  SPACE_AROUND: 6,
  SPACE_EVENLY: 7,
} as const;

type TAlignment = (typeof Alignment)[keyof typeof Alignment];

export { Alignment };
export type { TAlignment };
