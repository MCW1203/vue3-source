export const enum ShapeFlags {
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1, //00000010  2    1*2^1
  STATEFUL_COMPONENT = 1 << 2,   //00000100  4    1*2^2
  TEXT_CHILDREN = 1 << 3,        //00001000  8    1*2^3
  ARRAY_CHILDREN = 1 << 4,       //00010000  16   1*2^4
  SLOTS_CHILDREN = 1 << 5,       //00500000  32   1*2^5
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

// 二进制 一个字符由8位组成，这8位最大1
//  1<<1 向左移动一位 00000001 00000010


//  | 或运算 合并
// 00000001 | 00000010 ===>00000011