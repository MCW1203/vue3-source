
import { createVNode } from './vnode'

export function apiCreateApp(render) {
    return function createApp(rootComponent, rootProps) { //告诉他是哪个组件，哪个属性
        const app = {
            // 添加相关属性
            _component: rootComponent,
            _props: rootProps,
            _container: null,
            mount(container) { // 挂载组件  
                // console.log(container, rootComponent, rootProps, rendererOptions)
                // 1.创建vnode 根据组件创建虚拟节点
                let vnode = createVNode(rootComponent, rootProps)
                
                // 渲染组件 render(vnode,container)
                render(vnode, container)
                app._container = container
            }
        }
        return app
    }
}