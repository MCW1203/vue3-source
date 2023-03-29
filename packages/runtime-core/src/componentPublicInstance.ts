import { hasOwn } from "@vue/shared"

/** 
* 处理proxy代理，在render中可以直接访问props中的属性
**/
export const componentPublicInstance = {
    get({ _: instance }, key) {
        // 获取值 proxy | children | data
        const { props, data, setupState } = instance
        if(key[0]=='$'){
            return
        }
        if (hasOwn(props, key)) {
            return props[key]
        } else if (hasOwn(setupState, key)) {
            return setupState[key]
        }
    },
    // value:最新的值
    set({ _: instance }, key, value) {
        const { props, data, setupState } = instance
        if (hasOwn(props, key)) {
            props[key]=value
        } else if (hasOwn(setupState, key)) {
            setupState[key]=value
        }
    }
}