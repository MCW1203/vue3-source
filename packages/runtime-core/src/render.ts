
/* 
*渲染器
*
*
*
*/
import {apiCreateApp} from './apiCreateApp'
export function createRenderer(rendererOptions) {
    // 渲染器
    let render=(vnode,container)=>{
        // 组件初始化
        console.log('vnode',vnode)
        
    }
    return {
        createApp:apiCreateApp(render) //vnode 在框架中 组件操作==》vnode==>render()
    }
}

