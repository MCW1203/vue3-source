/**
*  变成虚拟dom
*  h('div',{},'hello')  
*  h('div','hello')  
*  h('div',{}) or h('div',{},['list']) 
*  h('div',{},[h('div',{},'list')]) 
* */

import { isArray, isObject } from "@vue/shared"
import { createVNode, isVnode } from "./vnode"

// type:元素的类型   propsOrChildren:属性或者儿子  children:儿子
export function h(type, propsOrChildren?, children?) {
    // 参数处理
    const i = arguments.length //获取参数的个数
    if (i == 2) {
        // 元素+属性   元素+children
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
            // 元素+属性
            if (isVnode(propsOrChildren)) {
                // 处理对象 h('div',h('div'))) 
                return createVNode(type, null, [propsOrChildren])
            }
            // 没有儿子
            return createVNode(type, propsOrChildren)

        } else {
            // 就是儿子
            return createVNode(type, null, propsOrChildren)
        }
    } else {
        if (i > 3) {
            // h('div',{},'hello','world','!')
            // 从第三个参数开始切割
            // children=[].slice.call(arguments,2)
            children = Array.prototype.slice.call(arguments, 2)
        } else if (i == 3 && isVnode(children)) {
            // h('div',{},h('div'))
            children = [children]
        }
        return createVNode(type, propsOrChildren, children)
    }
}