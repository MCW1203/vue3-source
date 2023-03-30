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
// createApp(app,{name:'555444'}).mount('#app') 接收传过来的参数 组件和相关属性
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

// vue3组件初始化
/** 
* Vue3的初始化流程相对于Vue2有了一些变化，下面是Vue3的初始化流程：
*
* 1.创建一个Vue实例：通过调用createApp方法创建一个Vue实例，该方法返回一个应用对象app。
* 2.创建根组件：通过调用app.component方法注册一个根组件，该方法接收两个参数：组件名称和组件选项对象。
* 3.实例化根组件：通过调用app.mount方法将根组件挂载到DOM上。该方法接收一个选择器字符串或DOM元素作为参数，表示将根组件挂载到哪个DOM节点上。
* 4.初始化数据：在实例化根组件时，Vue3会调用根组件的setup函数。该函数是Vue3中新引入的函数，它可以用来初始化数据、设置响应式数据等操作。
setup函数返回一个包含数据、方法等的对象，这些数据和方法可以在组件的模板中使用。
* 5.编译模板：Vue3使用了一个新的编译器来编译模板，这个编译器是基于AST的，它可以更快速地编译模板，并生成更小的运行时代码。
* 6.渲染组件：在编译模板后，Vue3会将组件渲染成虚拟DOM，并将虚拟DOM转化为真实的DOM节点，最终呈现在页面上。
* 7.响应式更新：当组件的数据发生变化时，Vue3会自动进行响应式更新，重新渲染组件，并将变化同步到页面上。
* 8.销毁组件：当组件不再需要使用时，Vue3会自动将组件从DOM中卸载，并释放相应的资源，防止内存泄漏。
* 
*
**/
export * from '@vue/runtime-core'