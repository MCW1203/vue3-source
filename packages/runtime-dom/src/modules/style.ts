// 处理style

// prevValue:旧值 nextValue：新值
export const patchStyle = (el, prevValue, nextValue) => {
    // 获取样式
    const style = el.style
    // 判断 新值为空则删除样式
    if (nextValue == null) {
        // 删除样式
        el.removeAttribute('style')
    } else {
        // 遍历
        // 老的有 新的没有，则把老的属性值去掉
        if (prevValue) {
            for (let key in prevValue) {
                if (nextValue[key] == null) {
                    style[key] = ''
                }
            }
        }
        // 新的有，老的没有，直接赋值
        for (let key in nextValue) {
            style[key] = nextValue[key]
        }
    }

}