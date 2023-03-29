// 事件处理
// 一个原生元素绑定事件 addEventListener  自定义事件 onClick or @click
// 如果原生与自定义同时存在则缓存事件处理函数
/* *
* 
* 1.给元素缓存一个绑定的事件列表
* 2.如果缓存中没有值，并且nextValue有值，则创建一个新的事件处理函数
* 3.以前绑定过 需要删除并且清除缓存
* 4.两个都有,直接改变invoker中的value，指向最新事件
* */

export function patchEvent(el,key,nextValue){
    // 1.对函数缓存
    const invokers = el._vei || (el._vei = {})
    const exists=invokers[key]
    // 2.判断原来的和新的
    if(exists && nextValue){
        // 如果存在则删除
        exists.value=nextValue
    }else{
        // 获取事件名称  （1）新的有（2）新的没有
        const eventName=key.slice(2).toLowerCase()
        if(nextValue){
            // 新的有
            // 创建一个函数
            const invoker=invokers[key]=createInvoker(nextValue)
            // 绑定事件
            el.addEventListener(eventName,invoker)
        }else{
            // 新的没有
            // 删除事件
            el.removeEventListener(eventName,exists)
            // 清除缓存
            invokers[eventName]=undefined
        }
    }
}

// 创建方法
function createInvoker(nextValue){
    const invoker=(e)=>{
        invoker.value(e)
    }
    invoker.value=nextValue
    return invoker
}

