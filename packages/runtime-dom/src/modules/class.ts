// 处理class

export const patchClass = (el, nextValue) => {
    if (nextValue == null) {
        nextValue = ''
    }
    // 对这个标签的class进行赋值
    el.className = nextValue
}