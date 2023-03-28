

// 公共方法
export function isObject(val) {
    return val !== null && typeof val === 'object'
}

// 合并对象
export const extend = Object.assign