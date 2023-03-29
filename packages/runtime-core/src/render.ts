
/* 
*渲染器
*
*
*
*/
import { ShapeFlags } from '@vue/shared'
import {apiCreateApp} from './apiCreateApp'
import { createComponentInstance, setupComponent, setupRenderEffect } from './component'


export function createRenderer(rendererOptions) {
    const mountComponent=(InitialVnode,container)=>{
        // 组件的渲染流程 核心 
        // 1.创建组件实例对象 render(proxy)
        const instance=InitialVnode.component=createComponentInstance(InitialVnode)
        // 2.解析数据到实例上
        setupComponent(instance)
        // 3.创建一个effect方法 让render方法执行
        setupRenderEffect(instance,container)
    }
    // 组建的创建
    const processComponent=(oldVnode,newVnode,container)=>{
        // 判断是否是第一次创建
        if(oldVnode==null){ 
            //组件的初始化
            mountComponent(newVnode,container)
        }else{
            // 组件更新
        }
    }
    // oldVnode:旧节点  newVnode:新节点  container:容器
    const patch=(oldVnode,newVnode,container)=>{
        // 针对不同的类型进行渲染
        let {shapeFlag}=newVnode
        if(shapeFlag & ShapeFlags.ELEMENT){ //元素
            // processElement(oldVnode,newVnode,container)
        }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){ //组件
            processComponent(oldVnode,newVnode,container)
        }
    }
    // 渲染器
    let render=(vnode,container)=>{
        // 组件初始化
        console.log('vnode',vnode)
        // 调用render方法,将vnode转换成真实dom
        // 第一次渲染时  null:原来的dom  vnode:新的dom  container:容器
        patch(null,vnode,container)
        
    }
    return {
        createApp:apiCreateApp(render) //vnode 在框架中 组件操作==》vnode==>render()
    }
}

