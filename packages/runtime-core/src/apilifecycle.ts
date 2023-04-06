// 生命周期

import { currentInstance, setCurrentInstance } from "./component"

// 枚举
const enum Lifecycle {
    BEFORE_CREATE = 'bc',
    CREATED = 'c',
    BEFORE_MOUNT = 'bm',
    MOUNTED = 'm',
    BEFORE_UPDATE = 'bu',
    UPDATED = 'u',
    BEFORE_UNMOUNT = 'bum',
    UNMOUNTED = 'um',
    ACTIVATED = 'a',
}

// 生命周期的钩子函数
export const onBeforeMount = createHook(Lifecycle.BEFORE_MOUNT)
export const onMounted = createHook(Lifecycle.MOUNTED)
export const onBeforeUpdate = createHook(Lifecycle.BEFORE_UPDATE)
export const onUpdated = createHook(Lifecycle.UPDATED)


/** 
* 1.返回值：函数
* 
* 
* 
* 
* 
**/
function createHook(lifecycle) {
    // 核心就是这个生命周期要和当前组件实例产生关联
    return function (hook, target = currentInstance) {  // hook：第一个参数就是用户生命周期中的方法 target：第二个参数就是当前组件实例 
        // 获取到当前组件的实例，和生命周期产生关联
        // debugger
        injectHook(lifecycle, hook, target)
    }
}


function injectHook(lifecycle: any, hook: any, target: any) {
    // vue3的生命周期都是在setup中执行的
    if (!target) {
        return
    }
    // 给这个实例添加生命周期
    const hooks = target[lifecycle] || (target[lifecycle] = [])
    // vue3源码用了切片
    const rap = () => {
        setCurrentInstance(target)
        hook()//执行生命周期前存放当前实例
        setCurrentInstance(null)
    }
    hooks.push(rap)
}
// 生命周期的执行
export const invokeArrayFns = (FnArr) => {
    FnArr.forEach(fn => {
        fn()
    })
}

/** 
* 1.vue3的生命周期都在当前组件实例上
* 2.因为生命周期要在setup中执行，所以要和当前组件实例产生关联，在调用这个setup之前产生一个全局的组件实例：currentInstance
*  在setup中使用生命周期
* 3.setup执行完毕后，把全局组件变成null
*  
**/




/************************************************************************************************* 
* Vue2 中组件的生命周期函数的执行顺序如下：
* 
* 1.beforeCreate：组件实例刚刚创建，此时组件的 data 和 methods 等属性还未初始化，此时可以进行一些初始化工作。
* 
* 2.created：组件实例已经创建完成，此时组件的 data 和 methods 等属性已经初始化，但是组件还未挂载到页面上。
* 
* 3.beforeMount：组件已经准备好将要挂载到页面上，此时组件的 template 和 render 函数已经编译完成，但是还未生成真正的 DOM 节点。
* 
* 4.mounted：组件已经挂载到页面上，此时组件的真实 DOM 已经生成，可以进行 DOM 操作和异步请求等操作。
* 
* 5.beforeUpdate：组件的状态发生变化，此时 Vue2 正在重新渲染组件，但是还未更新 DOM。
* 
* 6.updated：组件的状态已经更新完成，此时 Vue2 已经重新渲染组件，并且更新了 DOM，可以进行一些 DOM 操作和异步请求等操作。
* 
* 7.beforeUnmount：组件即将从页面上卸载，此时可以进行一些清理工作，如取消计时器、销毁子组件等操作。
* 
* 8.unmounted：组件已经从页面上卸载，此时组件的所有事件监听器和定时器等资源已经被销毁，可以进行一些善后工作。
* 
* 总的来说，Vue2 中组件的生命周期函数的执行顺序是从创建到销毁，包括创建、挂载、更新和卸载等阶段，开发者可以根据自己的需求在不同的生命周期函数中进行不同的操作，以达到更好的效果。
* 
****************************************************************************************************/