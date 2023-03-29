

// 公共方法
export function isObject(val) {
    return val !== null && typeof val === 'object'
}

// 合并对象
export const extend = Object.assign
// 判断是否是数组
export const isArray = Array.isArray
// 判断是否是函数
export const isFunction = (val) => typeof val === 'function'
// 判断是否是数字
export const isNumber = (val) => typeof val === 'number'
// 判断是否是字符串
export const isString = (val) => typeof val === 'string'
// 判断是否是symbol
export const isSymbol = (val) => typeof val === 'symbol'
// 判断是否是boolean
export const isBoolean = (val) => typeof val === 'boolean'
// 判断是否是undefined
export const isUndefined = (val) => typeof val === 'undefined'
// 判断是否是null
export const isNull = (val) => val === null
// 判断是否是空对象
export const isPlainObject = (val) => Object.prototype.toString.call(val) === '[object Object]'
// 判断对象中是否有某个属性
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

// 判断数组的key是否是整数值
export const isIntegerKey = (key) =>parseInt(key) === key

// 判断两个值是否相等
export const haseChange = (oldValue,newValue) => oldValue !== newValue

export * from './shapeFlags'