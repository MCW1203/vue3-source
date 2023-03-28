import {isObject} from '@vue/shared'

import {reactiveHandler,shallowReactiveHandler,readonlyHandler,shallowReadonlyHandler} from './baseHandlers'

export function reactive(target,) {
  // 创建响应式对象
  return createReactObj(target,false,reactiveHandler)
}

export function shallowReactive(target,){
    return createReactObj(target,false,shallowReactiveHandler)
}

export function readonly(target,){
    return createReactObj(target,true,readonlyHandler)
}

export function shallowReadonly(target,){
    return createReactObj(target,true,shallowReadonlyHandler)
}

// 数据结构
// WeakMap 用于存储代理对象和原始对象的对应关系 1：key必须是对象  2：自动垃圾回收
const reactiveMap = new WeakMap()
const readonlyReactiveMap = new WeakMap()
// 实现代理对象的创建
function createReactObj(target,isReadonly,baseHandlers){
    // proxy 代理对象
    if(!isObject(target)){
        return target
    }
    // 1.判断是否已经代理过
    const proxyMap=isReadonly?readonlyReactiveMap:reactiveMap
    const existProxy=proxyMap.get(target)
    if(existProxy){
        return existProxy
    }
    // 核心 proxy 
    // baseHandlers 处理拦截的对象{get,set}
    const proxy = new Proxy(target,baseHandlers)
    // 2.缓存代理对象
    proxyMap.set(target,proxy)
    return proxy
}

// 核心 proxy 高阶函数：柯里化