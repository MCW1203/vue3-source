
/* 
*渲染器
*
*
*
*/
import { ShapeFlags } from '@vue/shared'
import { apiCreateApp } from './apiCreateApp'
import { createComponentInstance, setupComponent } from './component'
import { effect } from '@vue/reactivity'
import { CVnode, TEXT } from './vnode'

// rendererOptions 操作节点和属性的方法
export function createRenderer(rendererOptions) {
    // 获取全部dom操作方法
    const {
        insert: hostInsert,// 插入节点
        remove: hostRemove,// 删除节点
        patchProp: hostPatchProp,// 属性操作
        createElement: hostCreateElement, // 创建元素
        createText: hostCreateText,// 创建文本
        createComment: hostCreateComment,// 创建注释
        setText: hostSetText,// 设置文本
        setElementText: hostSetElementText,// 设置元素文本
    } = rendererOptions
    // 创建一个effect方法 让render方法执行
    function setupRenderEffect(instance, container) {
        // 创建一个effect 在effect中调用render方法 ，这样render中获取数据会收集effect
        // 当属性发生变化时，会重新执行effect方法，重新执行render方法
        effect(function componentEffect() {
            // 判断是否是第一次记载组件
            if (!instance.isMounted) {
                // 获取到render返回值
                // 组件实例 被代理过的
                let proxy = instance.proxy
                //执行render  组件中创建渲染的节点 h函数有多种写法
                /**
                *  h('div',{},'hello')  
                *  h('div','hello')  
                *  h('div',{}) or h('div',{},['list']) 
                *  h('div',{},[h('div',{},'list')]) 
                * */
                //  1.h函数是创建一个虚拟dom 组件渲染的节点
                let subTree = instance.subTree = instance.render.call(proxy, proxy)
                //  2.渲染到页面中
                // console.log('subTree',subTree)
                // 渲染子树 递归 创建元素
                patch(null, subTree, container)
                // 首次加载完成后，更改状态
                instance.isMounted = true
            } else {
                // 组件更新
                // console.log('组件更新')
                // 比对，将旧的和新的进行比对
                // 获取实例
                let proxy = instance.proxy
                // 1.获取到旧的虚拟dom
                const prevTree = instance.subTree
                // 2.获取到新的虚拟dom
                const nextTree = instance.render.call(proxy, proxy)
                // 3.比对
                instance.subTree = nextTree //替换
                patch(prevTree, nextTree, container)
            }
        })
    }
    // 处理组件
    //*******************   处理组件   ******************************* */
    const mountComponent = (InitialVnode, container) => {
        // 组件的渲染流程 核心 
        // 1.创建组件实例对象 render(proxy)
        const instance = InitialVnode.component = createComponentInstance(InitialVnode)
        // 2.解析数据到实例上
        setupComponent(instance)
        // 3.创建一个effect方法 让render方法执行
        setupRenderEffect(instance, container)
    }
    // 组建的创建
    const processComponent = (oldVnode, newVnode, container) => {
        // 判断是否是第一次创建
        if (oldVnode == null) {
            //组件的初始化
            mountComponent(newVnode, container)
        } else {
            // 组件更新
        }
    }
    // 处理文本
    //**************************    处理文本   ************************ */
    const processText = (oldVnode, newVnode, container) => {
        if (oldVnode == null) {  //第一次创建
            // 创建文本元素并插入到对应位置
            hostInsert((newVnode.el = hostCreateText(newVnode.children)), container)
        } else {
            // 文本更新
        }
    }
    // 处理元素
    //**************************    处理元素   ************************ */
    // 处理子元素children
    const mountChildren = (children, el) => {
        // 递归渲染
        for (let i = 0; i < children.length; i++) {
            let child = CVnode(children[i])
            // 创建文本 元素   
            patch(null, child, el)
        }
    }
    // 加载元素
    const mountElement = (vnode, container) => {
        // 创建真实dom h('div',{},[h('div',{},'list')]) ==>dom操作===》放到页面
        // 递归渲染
        // 获取元素的属性
        const { props, shapeFlag, type, children } = vnode
        // 获取真实的元素 dom节点
        // 创建元素
        let el = vnode.el = hostCreateElement(type)
        // 添加属性
        for (let key in props) {
            hostPatchProp(el, key, null, props[key])
        }
        //创建元素-添加属性===> h('div',{style:{color:'red'}},'hello')==><div style='color:red'></div>
        // 处理子元素 children
        if (children) {
            if (shapeFlag & ShapeFlags.TEXT_CHILDREN) { //文本
                // 创建文本元素
                hostSetElementText(el, children)
            } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {  //children是数组
                // 递归  数组   h('div',{style:{color:'red'}},['hello',222])
                mountChildren(children, el)
            }
        }
        //创建元素-添加属性-处理子元素===> h('div',{style:{color:'red'}},'hello')==><div style='color:red'>hello</div>
        // console.log('mountElement', el)

        // 放到对应的位置
        hostInsert(el, container)
    }
    // 处理属性 属性（props）比对
    const patchProps=(oldProps,newProps,el)=>{
        //  旧：<div class style 属性></div>  新：<div class style></div>
        // 循环遍历
        if(oldProps!==newProps){
            for(let key in newProps){
                if(oldProps[key]!==newProps[key]){
                    // 旧属性与新属性不相同 替换属性
                    hostPatchProp(el,key,oldProps[key],newProps[key])
                }
            }
            for(let key in oldProps){
                if(!newProps[key]){
                    // 旧的属性，新的没有，则删除属性
                    hostPatchProp(el,key,null,newProps[key])
                }
            }
        }
        //  旧：<div class style></div>       新：<div class style 属性></div>
        
        
    }
    // 同一个元素比对
    const patchElement=(oldVnode, newVnode, container)=>{
        // <div class style 属性></div>  <div class style></div>
        const el=(newVnode.el=oldVnode.el)
        const oldProps=oldVnode.props||{}
        const newProps=newVnode.props||{}
        // 处理属性
        patchProps(oldProps,newProps,el)
    }
    // 加载组件
    const processElement = (oldVnode, newVnode, container) => {
        if (oldVnode == null) {  //第一次创建
            // console.log('重新加载')
            mountElement(newVnode, container)
        } else {
            // 同一个元素
            console.log('同一个元素')
            patchElement(oldVnode, newVnode, container)
        }
    }
    // 判断是不是同一个元素 1.标签名 2.key
    const isSomeVnode = (oldVnode, newVnode) => {
        return oldVnode.type === newVnode.type && oldVnode.key === newVnode.key
    }
    // 卸载旧的节点
    const unmont = (oldVnode) => {
        hostRemove(oldVnode.el)
    }
    // oldVnode:旧节点  newVnode:新节点  container:容器
    const patch = (oldVnode, newVnode, container) => {
        // 针对不同的类型进行渲染
        // 比对 1：判断是不是同一个元素
        if (oldVnode && !isSomeVnode(oldVnode, newVnode)) {
            unmont(oldVnode)  //删除元素
            oldVnode = null   //重新加载
        }
        let { shapeFlag, type } = newVnode
        switch (type) {
            case TEXT:
                // 处理文本
                processText(oldVnode, newVnode, container)
                break
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) { //元素
                    console.log('元素', oldVnode, newVnode, container)
                    // 加载组件
                    processElement(oldVnode, newVnode, container)
                } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { //组件
                    processComponent(oldVnode, newVnode, container)
                }
        }

    }
    // 渲染器
    let render = (vnode, container) => {
        // 组件初始化
        console.log('vnode', vnode)
        // 调用render方法,将vnode转换成真实dom
        // 第一次渲染时  null:原来的dom  vnode:新的dom  container:容器
        patch(null, vnode, container)

    }
    return {
        createApp: apiCreateApp(render) //vnode 在框架中 组件操作==》vnode==>render()
    }
}

/**
* setup 返回值处理
* 1.返回函数setup{return ()=>{}}，将函数放到render上，执行render方法
* 2.返回对象setup{return {}}，将函数放到render上
*
*
**/