/* 
* 创建vnode
* createVNode和h()一样
* createVNode=h('div',{style:{color:'red'}},'hello world')
* 区分是组件还是虚拟dom
* 创建vnode
*/
import { ShapeFlags, isArray, isObject, isString } from '@vue/shared'
export const createVNode = (type, props, children = null) => {
    console.log(type, props)
    // 区分是组件的vnode还是元素的vnode 
    // 使用位移运算符
    let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0
    const vnode = {
        _v_isVnode: true, //是一个虚拟节点
        type,
        props,
        children,
        key: props && props.key,//diff算法会用到
        component: null,//实例对象
        el: null,   //使vnode和真实dom对应
        shapeFlag,  //标识 区分是组件还是vnode
    }
    // 儿子children 也需要标识
    normalizeChildren(vnode, children)
    return vnode

}

function normalizeChildren(vnode, children) {
    let type = 0
    if (children == null) {

    } else if (isArray(children)) {  //数组
        type = ShapeFlags.ARRAY_CHILDREN
    } else {  //文本
        type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag = vnode.shapeFlag | type
}