// runtime-dom
/* 
* 操作dom  
* 1.节点 nodeOps.ts
* 2.属性 patchProp.ts
*/
import { extend } from '@vue/shared'
import { createRenderer } from '@vue/runtime-core'

// 创建两个文件
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

// vue3中 dom全部操作
const rendererOptions = extend({ patchProp }, nodeOps)

export const createApp = (tootComponent, rootProps) => {
    // 创建渲染器
    let app = createRenderer(rendererOptions).createApp(tootComponent, rootProps)
    let { mount } = app
    app.mount = (container) => { //  #app
        // 挂载组件
        // 清空容器
        container = document.querySelector(container)
        container.innerHTML = ''
        // 将组件渲染到容器中
        mount(container)
    }
    return app
}

// 总结
/** 
* 1.创建createAPP方法 ====》runtime-dom 但是渲染组件是在不同的平台上
* 2.
* 3.
* 
**/
